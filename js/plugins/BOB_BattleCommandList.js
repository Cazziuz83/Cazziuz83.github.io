//=============================================================================
// Bobstah Plugins
// BOB_BattleCommandList.js
// Version: 1.7
//=============================================================================
 
var Imported = Imported || {};
Imported.BOB_BattleCommandList = true;
 
var Bobstah = Bobstah || {};
Bobstah.BattleCmds = Bobstah.BattleCmds || {};
 
//=============================================================================
 /*:
 * @plugindesc Allows further customization of battle command menus by class
 * and actor.
 * @author Bobstah
 *
 * ============================================================================
 * Params
 * ============================================================================
 * @param Force Default Commands
 * @desc If 1, will use the Default Battle Commands if none set at class level. If 0, use Actor Commands instead.
 * @default 1
 *
 * @param Show Help Window
 * @desc If 1, show a help window that shows Skill and Item descriptions when selected.
 * @default 1
 *
 * @param Help Window Position
 * @desc 0 = custom, 1 = global help window default, 2 = above battle status
 * @default 2
 *
 * @param Help Window X
 * @desc The X coordinate of the help window. Used if Help Window Position is 2. If 0, use default.
 * @default 0
 *
 * @param Help Window Y
 * @desc The Y coordinate of the help window. Used if Help Window Position is 2. If 0, use default.
 * @default 0
 *
 * @param Help Window Height
 * @desc The height of the help window. Used if Help Window Position is 2. If 0, use default.
 * @default 0
 *
 * @param Help Window Width
 * @desc The width of the help window. Used if Help Window Position is 2. If 0, use default.
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Allows the modification of battle commands on an actor and/or class basis.
 * This also allows you to add skills and items directly onto the command list.
 * Some command options are restricted to class. See Command Defintions for
 * more information.
 *
 * If no battle commands are set at the class level, it will use the actor's
 * command list instead. If the actor or class has no battle commands set, the
 * default list will be used.
 *
 * To add additional Custom Battle Commands from your (or another) plugin,
 * scroll to the Additional Plugins Custom Battle Commands section. You
 * shouldn't need to modify this plugin, I promise!
 *
 *
 * ============================================================================
 * Recommended Usage
 * ============================================================================
 *
 * Set only actor-specific commands (maybe a skill or skilltype, etc) on each
 * actor. Set the general attack, skill, item, etc commands on each class,
 * then insert ActorCmd where you want the actor's commands to show up.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Class
 *   <Battle Commands>
 *   Attack
 *   Skills
 *   STypes(CommandName):ID,ID,etc
 *   Skill:ID
 *   FirstSkill:ID,ID,etc
 *   LastSkill:ID,ID,etc
 *   Item:ID
 *   FirstItem:ID,ID,etc
 *   LastItem:ID,ID,etc
 *   ActorCmd
 *   Items
 *   Guard
 *   </Battle Commands>
 *
 * Actor (ActorCmd is not valid for an Actor! Do not use!)
 *   <Battle Commands>
 *   Attack
 *   Skills
 *   STypes(CommandName):ID,ID,etc
 *   Skill:ID
 *   FirstSkill:ID,ID,etc
 *   LastSkill:ID,ID,etc
 *   Item:ID
 *   FirstItem:ID,ID,etc
 *   LastItem:ID,ID,etc
 *   Items
 *   Guard
 *   </Battle Commands>
 *
 * ============================================================================
 * Command Defintions
 * ============================================================================
 *
 * Class & Actor
 *   Attack - Use the default attack command
 *   Skills - Show the default skill list
 *   STypes(CommandName):ID,ID,etc - Show a skill menu named CommandName using
 *                       the skill types ID,ID,etc.
 *   Skill:ID - Show a specific skill ID, if the actor knows it and can use it.
 *   FirstSkill:ID,ID,etc - Show the first learned skill in the provided list.
 *   LastSkill:ID,ID,etc - Show the last learned skill in the provided list.
 *   Item:ID - Show a specific item, if it is in the party inventory
 *   FirstItem:ID,ID,etc - Show the first owned item in the provided list.
 *   LastItem:ID,ID,etc - Show the last owned item in the provided list.
 *   Items - Show the default item command
 *   Guard - Show the default Guard command.
 *
 * Class
 *   ActorCmd - Show the list of actor commands.
 *
 * ============================================================================
 * Additional Plugins Custom Battle Commands
 * ============================================================================
 *
 * As this plugin overwrites the default Scene_Battle.makeCommandList function,
 * it would be impossible for additional plugins to add new commands.
 * To facilitate this, you can add an object to the below array.
 * This array is looped through, and the object evaluated by both
 * Window_ActorCommand.makeCommandList and Scene_Battle.createActorCommandWindow.
 *
 * Sample object:
 * myPlugin.myCustomBattleCommands = {
         makeCommandList: 'myPluginMakeCommandList',  //String, function name inside Window_ActorCmd
         createActorCommandWindow: 'myPluginCreateActorCommandWindow'  //String, function name inside Scene_Battle
 * }
 *
 * Below is what Window_ActorCommand.prototype.myPluginMakeCommandList from the above example might resemble:
 * Window_Actor.prototype.myPluginMakeCommandList = function(cmd) { //cmd is the current Battle Command from the notetag
 *   if (cmd === "myPluginCustomCommand") {
 *          this.addMyPluginCustomCommand();
 *   }
 * }
 *
 * Below is what Scene_Battle.prototype.myPluginCreateActorCommandWindow from the above example might resemble:
 * Scene_Battle.prototype.myPluginCreateActorCommandWindow = function() {
 *   this._actorCommandWindow.setHandler('myCustomCommandHandler', this.myCustomCommand.bind(this));
 * }
 *
 * Once you've done all that, you can pass the myCustomBattleCommands object from the above
 * example to Bobstah.BattleCmds.addCustom(myCustomBattleCommands) and watch it work!
 */
//=============================================================================
 
//=============================================================================
// Parameter Variables
//=============================================================================
 
Bobstah.Parameters = PluginManager.parameters('BOB_BattleCommandList');
Bobstah.Param = Bobstah.Param || {};
 
Bobstah.Param.BattleCommandList_ForceDefaultCommands = Number(Bobstah.Parameters['Force Default Commands']);
Bobstah.Param.BattleCommandList_ShowHelpWindow = Number(Bobstah.Parameters['Show Help Window']);
Bobstah.Param.BattleCommandList_HelpWindowPosition = Number(Bobstah.Parameters['Help Window Position']);
Bobstah.Param.BattleCommandList_HelpWindowX = Number(Bobstah.Parameters['Help Window X']);
Bobstah.Param.BattleCommandList_HelpWindowY = Number(Bobstah.Parameters['Help Window Y']);
Bobstah.Param.BattleCommandList_HelpWindowHeight = Number(Bobstah.Parameters['Help Window Height']);
Bobstah.Param.BattleCommandList_HelpWindowWidth = Number(Bobstah.Parameters['Help Window Width']);
 
//=============================================================================
// Custom Plugin Battle Commands
//=============================================================================
Bobstah.BattleCmds.Custom = [];
Bobstah.BattleCmds.addCustom = function(customBattleCommand) {
        this.Custom.push(customBattleCommand);
}
 
Bobstah.BattleCmds.positionHelp = function(helpWindow, refWindow) {
        switch (Bobstah.Param.BattleCommandList_HelpWindowPosition) {
                case 2:
                        var helpY = refWindow.y - helpWindow.height;
                        helpWindow.move(0,helpY,helpWindow.width,helpWindow.height);
                break;
               
                case 0:
                        var helpX = (Bobstah.Param.BattleCommandList_HelpWindowX !== 0 ? Bobstah.Param.BattleCommandList_HelpWindowX : helpWindow.x);
                        var helpY = (Bobstah.Param.BattleCommandList_HelpWindowY !== 0 ? Bobstah.Param.BattleCommandList_HelpWindowY : helpWindow.y);
                        var helpH = (Bobstah.Param.BattleCommandList_HelpWindowHeight !== 0 ? Bobstah.Param.BattleCommandList_HelpWindowHeight : helpWindow.height);
                        var helpW = (Bobstah.Param.BattleCommandList_HelpWindowWidth !== 0 ? Bobstah.Param.BattleCommandList_HelpWindowWidth : helpWindow.width);
                        helpWindow.move(helpX, helpY, helpW, helpH);
                break;
               
                default:
                        return false;
                break;
        }
}
 
//=============================================================================
// DataManager
//=============================================================================
Bobstah.BattleCmds.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Bobstah.BattleCmds.DataManager_isDatabaseLoaded.call(this)) return false;
        DataManager.processBobstahBattleCmdNotes($dataActors);
    DataManager.processBobstahBattleCmdNotes($dataClasses);
        return true;
};
 
DataManager.processBobstahBattleCmdNotes = function(group) {
        var cmdlist = /<Battle Commands>[\s]+([\s\S]*?)[\r|\n]+<\/Battle Commands>/i;
       
        for (var n = 1; n < group.length; n++) {
                var obj = group[n];
 
                obj.battleCommands = [];
                if (obj.note.match(cmdlist)) {
                        var notedata = RegExp.$1.split(/[\r\n]+/);
                        for (var i = 0; i < notedata.length; i++) {
                                obj.battleCommands.push(notedata[i].replace(/^\s+|\s+$/g, ''));
                        }
                }
        }
};
 
//=============================================================================
// Game_Actor
//=============================================================================
Game_Actor.prototype.battleCommandList = function() {
        var classCommands = $dataClasses[this._classId].battleCommands;
        var actorCmd = null;
        for(var i = 0; i < classCommands.length; i++) {
                cmd = classCommands[i];
                if (cmd.match(/ActorCmd/i)) {
                        actorCmd = i;
                }
        }
        if (actorCmd != null) {
                classCommands.splice(actorCmd,1);
                var battleCommands = $dataActors[this._actorId].battleCommands.reverse();
                if (battleCommands.length > 0) {
                        for(var i = 0; i < battleCommands.length; i++) {
                                classCommands.splice(actorCmd,0,battleCommands[i]);
                        }
                }
        } else if (classCommands.length === 0) {
                if (Bobstah.Param.BattleCommandList_ForceDefaultCommands === 0) {
                        classCommands = $dataActors[this._actorId].battleCommands;
                }
        }
        return classCommands;
};
 
//=============================================================================
// Window_SkillList
//=============================================================================
Bobstah.BattleCmds.WindowSkillList_setStypeId = Window_SkillList.prototype.setStypeId;
Window_SkillList.prototype.setStypeId = function(stypeId) {
    if (this.multipleSkills(stypeId) && stypeId !== this._stypeId) {
                this._stypeId = stypeId;
        this.refresh();
        this.resetScroll();
        } else {
                Bobstah.BattleCmds.WindowSkillList_setStypeId.call(this, stypeId);
        }
};
 
Bobstah.BattleCmds.WindowSkillList_includes = Window_SkillList.prototype.includes;
Window_SkillList.prototype.includes = function(item) {
    if (this.multipleSkills()) {
                if (this._stypeId.indexOf(item.stypeId) > -1) {
                        return true;
                } else {
                        return false;
                }
        } else {
                return Bobstah.BattleCmds.WindowSkillList_includes.call(this, item)
        }
       
       
        return item && item.stypeId === this._stypeId;
};
 
Window_SkillList.prototype.multipleSkills = function(stypeId) {
        stypeId = stypeId || this._stypeId;
        if (stypeId === null) { return false; }
        if (typeof(stypeId) === "number") { return false; }
        if (typeof(stypeId.length) === "undefined") { return false; }
        if (stypeId.length > 0) { return true; }
        return false;
};
 
//=============================================================================
// Window_ActorCommand
//=============================================================================
Bobstah.BattleCmds.WindowActor_select = Window_ActorCommand.prototype.select;
Window_ActorCommand.prototype.select = function(index) {
        res = Bobstah.BattleCmds.WindowActor_select.call(this, index);
        if (Bobstah.Param.BattleCommandList_ShowHelpWindow === 0 || index === -1) { return res; }
        var cmd = this.currentData(index);
        if (typeof(cmd) === "undefined") { return res; }
        if (cmd.symbol === "customSkill" || cmd.symbol === "customItem") {
                //this.updateHelp();
                this.setHelpWindowItem(cmd.ext);
                this.showHelpWindow();
        } else {
                this.hideHelpWindow();
        }
        return res;
}
 
Bobstah.BattleCmds.WindowActor_processOk = Window_ActorCommand.prototype.processOk;
Window_ActorCommand.prototype.processOk = function() {
        Bobstah.BattleCmds.WindowActor_processOk.call(this);
        if (Bobstah.Param.BattleCommandList_ShowHelpWindow === 1) {
                this.hideHelpWindow();
        }
}
 
Bobstah.BattleCmds.WindowActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
Window_ActorCommand.prototype.makeCommandList = function() {
        if (this._actor) {
        var battleCommands = this._actor.battleCommandList();
                if (battleCommands.length != 0) {
                        for(var i = 0; i < battleCommands.length; i++) {
                                var cmd = battleCommands[i];
                                switch (cmd.toLowerCase())
                                {
                                        case "attack":
                                                this.addAttackCommand();
                                        break;
                                       
                                        case "skills":
                                                this.addSkillCommands();
                                        break;
                                       
                                        case "guard":
                                                this.addGuardCommand();
                                        break;
                                       
                                        case "items":
                                                this.addItemCommand();
                                        break;
                                       
                                        default:
                                                if (cmd.match(/^skill:[\s]*([0-9]+)/i)) {
                                                        this.addCustomSkillCommand(RegExp.$1);
                                                        break;
                                                } else if (cmd.match(/^item:[\s]*([0-9]+)/i)) {
                                                        this.addCustomItemCommand(RegExp.$1);
                                                        break;
                                                } else if (cmd.match(/^stypes\((\S+)\)[\s+]*:/ig)) {
                                                        var skillName = RegExp.$1;
                                                        var rawNotes = cmd.split(/:[\s]*/);
                                                        this.addMultiSkillCommand(skillName, rawNotes[1]);
                                                        break;
                                                } else if (cmd.match(/^skillfirst:[\s]*(\S+)/i)) {
                                                        this.addFirstSkillCommand(RegExp.$1);
                                                        break;
                                                }  else if (cmd.match(/^skilllast:[\s]*(\S+)/i)) {
                                                        this.addLastSkillCommand(RegExp.$1);
                                                        break;
                                                }   else if (cmd.match(/^itemfirst:[\s]*(\S+)/i)) {
                                                        this.addFirstItemCommand(RegExp.$1);
                                                        break;
                                                }   else if (cmd.match(/^itemlast:[\s]*(\S+)/i)) {
                                                        this.addLastItemCommand(RegExp.$1);
                                                        break;
                                                } else if (Bobstah.BattleCmds.Custom.length > 0) {
                                                        for (var customId = 0; customId < Bobstah.BattleCmds.Custom.length; customId++)
                                                        {
                                                                var custom = Bobstah.BattleCmds.Custom[customId].makeCommandList;
                                                                this[custom](cmd);
                                                        }
                                                        break;
                                                }
                                        break;
                                }
                        }
                } else {
                        Bobstah.BattleCmds.WindowActorCommand_makeCommandList.call(this);
                }
    }
};
 
Window_ActorCommand.prototype.addMultiSkillCommand = function(skillName, input) {
        var stypes = null;
        //Accepts comma-separated string or array of skill IDs.
        if (typeof(input) === "string") {
                var styperegex = /(\d)+/g;
                var stype;
                var validSkills = this._actor.addedSkillTypes();
                while (matches = styperegex.exec(input)) {
                        stype = Number(matches[0]);
                        if (validSkills.indexOf(stype) > -1) {
                                stypes = stypes || [];
                                stypes.push(stype);
                        }
                }
        } else if (typeof(input.length) !== "undefined") {
                if (input.length > 0) {
                        stypes = input;
                }
        }
        if (stypes === null) { return false; }
        this.addCommand(skillName, 'skill', true, stypes);
}
 
Window_ActorCommand.prototype.addCustomSkillCommand = function(skillId) {
        var skill = $dataSkills[skillId];
        skillId = Number(skillId);
        if (this._actor.isLearnedSkill(skillId) || this._actor.addedSkills().contains(skillId)) {
                this.addCommand(skill.name, 'customSkill', this._actor.canUse(skill), skill);
        }
}
 
Window_ActorCommand.prototype.addCustomItemCommand = function(itemId) {
        var item = $dataItems[itemId];
        if ($gameParty.hasItem(item,true)) {
                this.addCommand(item.name, 'customItem', this._actor.canUse(item), item);
        }
}
 
Window_ActorCommand.prototype.addFirstSkillCommand = function(input)
{
        var listRegex = /(\d+)/g;
        var skillId = 0;
        while (res = listRegex.exec(input)) {
                skillId = res[0];
                if (this._actor.isLearnedSkill(skillId) || this._actor.addedSkills().contains(Number(skillId))) {
                        var skill = $dataSkills[Number(skillId)];
                        this.addCommand(skill.name, 'customSkill', this._actor.canUse(skill), skill);
                        return true;
                }
        }
        return false;
}
 
Window_ActorCommand.prototype.addLastSkillCommand = function(input)
{
        var listRegex = /(\d+)/g;
        var skillId = 0;
        var tempId = null;
        while (res = listRegex.exec(input)) {
                var tempId = res[0];
                if (this._actor.isLearnedSkill(tempId) || this._actor.addedSkills().contains(Number(tempId))) {
                        skillId = Number(tempId);
                }
        }
        if (skillId === 0) { return false; }
       
        var skill = $dataSkills[skillId];
        this.addCommand(skill.name, 'customSkill', this._actor.canUse(skill), skill);
        return true;
}
 
Window_ActorCommand.prototype.addFirstItemCommand = function(input)
{
        var listRegex = /(\d+)/g;
        var itemId = 0;
        while (res = listRegex.exec(input)) {
                itemId = Number(res[0]);
                var item = $dataItems[itemId];
                if ($gameParty.hasItem(item,true)) {
                        this.addCommand(item.name, 'customItem', this._actor.canUse(item), item);
                        return true;
                }
        }
        return false;
}
 
Window_ActorCommand.prototype.addLastItemCommand = function(input)
{
        var listRegex = /(\d+)/g;
        var itemId = 0;
        var item = null;
        while (res = listRegex.exec(input)) {
                var tempId = Number(res[0]);
                var tempItem = $dataItems[tempId];
                if ($gameParty.hasItem(tempItem,true)) {
                        item = tempItem;
                }
        }
        if (item === null) { return false; }
 
        this.addCommand(item.name, 'customItem', this._actor.canUse(item), item);
        return true;
}
 
//=============================================================================
// Scene_Battle
//=============================================================================
Bobstah.BattleCmds.SceneBattle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
        this._actorCommandWindow = new Window_ActorCommand();
    this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
    this._actorCommandWindow.setHandler('skill',  this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler('guard',  this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler('item',   this.commandItem.bind(this));
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    this._actorCommandWindow.setHandler('customSkill', this.onCustomSkillOk.bind(this));
        this._actorCommandWindow.setHandler('customItem', this.onCustomItemOk.bind(this));
        if (Bobstah.BattleCmds.Custom.length > 0) {
                for (var customId = 0; customId < Bobstah.BattleCmds.Custom.length; customId++) {
                        var custom = Bobstah.BattleCmds.Custom[customId].createActorCommandWindow;
                        this[custom]();
                }
        }
        this.createHelpWindow();
        Bobstah.BattleCmds.positionHelp(this._helpWindow, this._statusWindow);
        this._actorCommandWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._actorCommandWindow);
};
 
Scene_Battle.prototype.onCustomSkillOk = function() {
    var skill = this._actorCommandWindow.currentExt();
    var action = BattleManager.inputtingAction();
    action.setSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};
 
Scene_Battle.prototype.onCustomItemOk = function() {
    var item = this._actorCommandWindow.currentExt();
    var action = BattleManager.inputtingAction();
    action.setItem(item.id);
    this.onSelectAction();
};