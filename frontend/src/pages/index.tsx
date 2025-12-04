
  /** SOCKET — START CALL */
  async handleStart(client: Socket, payload: { conversationId: string, mode: 'voice' | 'video' }) {
    try {
      const { conversationId, mode } = payload || {};
      if (!conversationId || !mode) return;

      const { token } = client.handshake.query as any;
      if (!token) return;

      const authUser = await this.authService.verifySession(token);
      if (!authUser) return;

      const currentUser = await this.authService.getSourceFromAuthSession(authUser);
      if (!currentUser) return;

      const conversation = await this.conversationService.findById(conversationId);
      if (!conversation) return;

      const other = conversation.recipients.find(
        (r) => `${r.sourceId}` !== `${currentUser._id}`
      );
      if (!other) return;

      const callerId = currentUser._id.toString();
      const calleeId = other.sourceId.toString();

      const { call, channelName } = await this.startCall(
        callerId,
        calleeId,
        conversationId,
        mode
      );

      const caller = await this.userService.findById(callerId);
      const callee = await this.userService.findById(calleeId);

      await this.socketUserService.emitToUsers(
        [calleeId],
        VIDEO_CALL_EVENT.INCOMING,
        {
          conversationId: conversation._id,
          callId: call._id,
          channelName,
          mode,
          fromUser: {
            _id: caller._id,
            username: caller.username,
            displayName: caller.name,
            avatar: caller.avatar,
            isOnline: caller.isOnline
          },
          toUser: {
            _id: callee._id,
            username: callee.username,
            displayName: callee.name,
            avatar: callee.avatar
          }
        }
      );

      client.emit('video-call/started', {
        conversationId,
        callId: call._id,
        channelName
      });
    } catch (e) {
      console.error('START CALL ERROR:', e);
    }
  }
