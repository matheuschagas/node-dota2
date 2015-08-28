var Dota2 = require("../index"),
    util = require("util");

// Methods
Dota2.Dota2Client.prototype.respondPartyInvite = function(id, accept) {
  id = id || null;
  accept = accept || false;

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (id == null) {
    if (this.debug) util.log("Party ID required to respond to an invite.");
    return null;
  }

  if (this.debug) util.log("Responding to party invite "+id+", accept: "+accept);
  // todo: set client version here?
  var payload = new Dota2.schema.CMsgPartyInviteResponse({
    "party_id": id,
    "accept": accept,
    "as_coach": false,
    "team_id": 0,
    "game_language_enum": 1,
    "game_language_name": "english"
  });
  this._protoBufHeader.msg = Dota2.EGCBaseMsg.k_EMsgGCPartyInviteResponse;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

Dota2.Dota2Client.prototype.leaveParty = function() {
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Leaving party.");

  var payload = new Dota2.schema.CMsgLeaveParty({});
  this.Party = null;
  this._protoBufHeader.msg = Dota2.EGCBaseMsg.k_EMsgGCLeaveParty;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

Dota2.Dota2Client.prototype.setPartyCoach = function(coach) {
  coach = coach || false;

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if(this.Party == null) {
    if(this.debug) util.log("setPartyCoach called when not in a party!");
    return null;
  }

  if (this.debug) util.log("Setting coach slot: "+coach);

  var payload = new Dota2.schema.CMsgDOTAPartyMemberSetCoach({"wants_coach": coach});
  this._protoBufHeader.msg = Dota2.k_EMsgGCPartyMemberSetCoach;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

Dota2.Dota2Client.prototype.inviteToParty = function(steam_id) {
  steam_id = steam_id || null;

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (steam_id == null) {
    if (this.debug) util.log("Steam ID required to create a party invite.");
    return null;
  }

  if (this.debug) util.log("Inviting "+steam_id+" to a party.");
  // todo: set client version here?
  var payload = new Dota2.schema.CMsgInviteToParty({
    "steam_id": steam_id
  });
  this._protoBufHeader.msg = Dota2.EGCBaseMsg.k_EMsgGCInviteToParty;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

Dota2.Dota2Client.prototype.kickFromParty = function(steam_id) {
  steam_id = steam_id || null;

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (steam_id == null) {
    if (this.debug) util.log("Steam ID required to kick from the party.");
    return null;
  }

  if (this.debug) util.log("Kicking "+steam_id+" from the party.");
  // todo: set client version here?
  var payload = new Dota2.schema.CMsgKickFromParty({
    "steam_id": steam_id
  });
  this._protoBufHeader.msg = Dota2.EGCBaseMsg.k_EMsgGCKickFromParty;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyListResponse] = function(message, callback) {
  var practiceLobbyListResponse = Dota2.schema.CMsgPracticeLobbyListResponse.decode(message);

  if (this.debug) util.log("Received practice lobby list response " + practiceLobbyListResponse);
  this.emit("practiceLobbyListResponse", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyResponse] = function(message, callback){
  var practiceLobbyResponse = Dota2.schema.CMsgPracticeLobbyJoinResponse.decode(message);

  if(this.debug) util.log("Received create/leave response "+JSON.stringify(practiceLobbyResponse));
  this.emit("practiceLobbyResponse", practiceLobbyResponse.result, practiceLobbyResponse);
  if(callback) callback(practiceLobbyResponse.result, practiceLobbyResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListResponse] = function(message, callback) {
  var practiceLobbyListResponse = Dota2.schema.CMsgFriendPracticeLobbyListResponse.decode(message);

  if (this.debug) util.log("Received friend practice lobby list response " + JSON.stringify(practiceLobbyListResponse));
  this.emit("friendPracticeLobbyListResponse", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};
