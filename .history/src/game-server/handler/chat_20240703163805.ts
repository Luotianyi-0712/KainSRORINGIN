import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';



export async function onGetFriendListInfo_cs_req(
    body: starrail.PVEBattleResultCsReq,
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {
    const proto: starrail.PVEBattleResultScRsp = new starrail.PVEBattleResultScRsp({
        retcode: 0,
        endStatus: body.endStatus,
        battleId: body.battleId,
    })
    const bufferData = starrail.PVEBattleResultScRsp.encode(proto).finish()
    await player.send(CmdID.CmdPVEBattleResultScRsp, bufferData);
}

export async function onPVEBattleResultCsReq(
    body: starrail.PVEBattleResultCsReq,
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {
    const proto: starrail.PVEBattleResultScRsp = new starrail.PVEBattleResultScRsp({
        retcode: 0,
        endStatus: body.endStatus,
        battleId: body.battleId,
    })
    const bufferData = starrail.PVEBattleResultScRsp.encode(proto).finish()
    await player.send(CmdID.CmdPVEBattleResultScRsp, bufferData);
}