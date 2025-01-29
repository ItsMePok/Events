import { system, world } from "@minecraft/server";
import { PokeTimeConfigUIMainMenu, PokeTimeGreeting, PokeTimeZoneOffset } from "./time";
world.afterEvents.playerJoin.subscribe((data => {
    let birthdays = JSON.parse(world.getDynamicProperty(`poke_events:birthdays`).toString());
    //console.warn(JSON.stringify(birthdays))
    system.runTimeout(() => {
        world.getAllPlayers().forEach((player => {
            //console.warn(`Joined Id ${player.id}, your: ${player.id}`)
            if (player.id == data.playerId) {
                let currentTime = new Date(Date.now() + PokeTimeZoneOffset(player));
                birthdays.forEach((birthday => {
                    var _a;
                    //console.warn(`${birthday.day == currentTime.getDate() && birthday.month == currentTime.getMonth()} Day ${currentTime.getDate()}, Month: ${currentTime.getMonth()}`)
                    if (birthday.day == currentTime.getDate() && birthday.month == currentTime.getMonth()) {
                        let name = { text: birthday.name };
                        if (birthday.style == "dev") {
                            name.translate = `translation.poke_events:birthdayDev`;
                        }
                        if (birthday.name = player.name) {
                            name.translate = `translation.poke_events:birthdayOwn`;
                        }
                        else if ((_a = birthday.name) === null || _a === void 0 ? void 0 : _a.endsWith(`s`)) {
                            name.text = `${birthday.name}'`;
                        }
                        else {
                            name.text = `${birthday.name}'s`;
                        }
                        player.sendMessage({ translate: `translation.poke_events:birthdayAnnounce`, with: { rawtext: [PokeTimeGreeting(currentTime, player, undefined, true), { text: player.name }, name] } });
                    }
                }));
            }
        }));
    }, 600);
}));
world.beforeEvents.worldInitialize.subscribe((event => {
    var _a;
    let birthdayProperty = world.getDynamicProperty(`poke_events:birthdays`);
    if (typeof birthdayProperty != "string")
        world.setDynamicProperty(`poke_events:birthdays`, `[]`);
    if (typeof world.getDynamicProperty(`poke_events:customEvents`) != "string") {
        world.setDynamicProperty(`poke_events:customEvents`, '[]');
        console.warn(`Custom events were invalid; resetting to default (Ignore if this world was just created) || Poke-Calendar`);
    }
    else {
        try {
            JSON.parse((_a = world.getDynamicProperty(`poke_events:customEvents`)) === null || _a === void 0 ? void 0 : _a.toString());
        }
        catch (_b) {
            console.warn(`Custom events were invalid; resetting to default || Poke-Calendar`);
            world.setDynamicProperty(`poke_events:customEvents`, '[]');
        }
    }
    event.itemComponentRegistry.registerCustomComponent("poke_events:timeConfig", {
        onUse(data) {
            PokeTimeConfigUIMainMenu(data.source);
        }
    });
}));
//# sourceMappingURL=main.js.map