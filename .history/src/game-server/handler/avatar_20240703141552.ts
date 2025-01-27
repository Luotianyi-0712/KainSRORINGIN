
import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { UidGenerator } from './inventory';
import { GameConfig } from 'src/data/loadConfig';

const UNLOCKED_AVATARS: number[] = [
    8001, 8002, 8003, 8004, 8005, 8006, 1001, 1002, 1003, 1004, 1005, 1006, 1008, 1009, 1013, 1101,
    1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1201, 1202, 1203, 1204, 1205,
    1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215, 1217, 1301, 1302, 1303, 1304, 1305,
    1306, 1307, 1308, 1309, 1312, 1315, 1310, 1314, 1221, 1218,
];

export async function onGetAvatarDataCsReq(
    body: starrail.GetAvatarDataCsReq,
    player: NetSession,
    dataModule: any | null = null
) {
    const genId: UidGenerator = new UidGenerator();
    const avatar_list: starrail.Avatar[] = [];

    // Load and process avatar configuration
    const jsonData: GameConfig = dataModule.getDataInGame();

    // Add unlocked avatars
    for (let i = 0; i < UNLOCKED_AVATARS.length; i++) {
        if (jsonData.avatar_config.findIndex(it => it.id === UNLOCKED_AVATARS[i]) !== -1) continue;
        const avatar = new starrail.Avatar({
            baseAvatarId: UNLOCKED_AVATARS[i],
            level: 80,
            promotion: 6,
            rank: 6,
            hasTakenRewardLevelList: Array.from({ length: 5 }, (_, index) => index + 1)
        });
        avatar_list.push(avatar);
    }

    for (const avatarConf of jsonData.avatar_config) {
        const avatar: starrail.Avatar = new starrail.Avatar({
            level: avatarConf.level,
            promotion: avatarConf.promotion,
            rank: avatarConf.rank,
            equipmentUniqueId: genId.nextId(),
            equipRelicList: Array.from({ length: 6 }, (_, index) => new starrail.EquipRelic({
                relicUniqueId: genId.nextId(),
                slot: index
            })),
            skilltreeList: [],
            hasTakenRewardLevelList: Array.from({ length: 5 }, (_, index) => index + 1)
        });

        switch (avatarConf.id) {
            case 8001:
            case 8002:
            case 8003:
            case 8004:
            case 8005:
            case 8006:
                avatar.baseAvatarId = 8006;
            case 1224: 
                avatar.baseAvatarId = 1001;
            default:
                avatar.baseAvatarId = avatarConf.id;
        }

        // Skills
        const skills = [1, 2, 3, 4, 7, 101, 102, 103, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210];
        for (const elem of skills) {
            let talentLevel: number = 0;
            if (elem === 1) {
                talentLevel = 6;
            } else if (elem <= 4) {
                talentLevel = 10;
            } else {
                talentLevel = 1;
            }
            const talent = new starrail.AvatarSkillTree({
                pointId: avatar.baseAvatarId * 1000 + elem,
                level: talentLevel,
            });
            avatar.skilltreeList.push(talent);
        }
        avatar_list.push(avatar);

        const multiPath = [1001, 1224, 8001, 8002, 8003, 8004, 8005, 8006]
        if (multiPath.includes(avatarConf.id)) {
            let avatarType : starrail.MultiPathAvatarType = starrail.MultiPathAvatarType.MultiPathAvatarTypeNone; 

            switch (avatarConf.id) {
                case 8001:
                case 8002:
                case 8003:
                case 8004:
                case 8005:
                case 8006:
                    avatarType = starrail.MultiPathAvatarType.GirlShamanType;
                case 1224: 
                    avatarType = 1001;
                default:
                    avatarType = starrail.MultiPathAvatarType.MultiPathAvatarTypeNone;
            }

            const proto1 = new starrail.SetAvatarPathScRsp({
                retcode: 0,
                avatarId: avatarType
            });
            const bufferData1 = starrail.SetAvatarPathScRsp.encode(proto1).finish();
            if (avatarType != starrail.MultiPathAvatarType.MultiPathAvatarTypeNone) {
                await player.send(CmdID.CmdSetAvatarPathScRsp, bufferData1);
            }
        }

    }

    // Create response
    const proto = new starrail.GetAvatarDataScRsp({
        retcode: 0,
        isAll: body.isGetAll,
        avatarList: avatar_list
    });

    // Encode and send response
    const bufferData = starrail.GetAvatarDataScRsp.encode(proto).finish();
    await player.send(CmdID.CmdGetAvatarDataScRsp, bufferData);
}
export async function onGetMultiPathAvatarInfoCsReq(
    body: object | any,
    player: NetSession,
    dataModule: any | null = null
) {
    const proto: starrail.GetMultiPathAvatarInfoScRsp = new starrail.GetMultiPathAvatarInfoScRsp({
        curMultiPathAvatarTypeMap: {
            1001: starrail.MultiPathAvatarType.Mar_7thRogueType,
            8001: starrail.MultiPathAvatarType.GirlShamanType
        }
    })
    const bufferData = starrail.GetMultiPathAvatarInfoScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetMultiPathAvatarInfoScRsp, bufferData);
}