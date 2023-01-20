// 用于处理用户断开连接
export async function run(hazel, core, hold) {
  core.removeSocket = function (socket) {
    // 断开连接
    socket.terminate();

    // 向所有用户广播用户退出的消息
    if (!socket.isInvisible) {
      if (typeof socket.channel == 'string') {
        core.broadcast({
          cmd: 'onlineRemove',
          nick: socket.nick,
        }, hold.channel[socket.channel].socketList);

        // 从 hold.channel 中删除用户
        hold.channel[socket.channel].socketList.delete(socket);

        // 如果用户退出的房间是 hold.channel 中最后一个用户，则删除该房间
        if (hold.channel[socket.channel].socketList.size == 0) {
          delete hold.channel[socket.channel];
        }

        // 写入存档
        core.archive('LEF', socket, '');
      }
    }
  }
}

export const priority = 32;
