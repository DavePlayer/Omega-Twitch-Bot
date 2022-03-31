
interface RobloxSettings {
    nicknameColor: String,
    donateAmmountColor: String,
    messageColor: String,
    textColor: String,
    fontSize: number,
    fontFamily: String
}

class Settings {
    Roblox: RobloxSettings;
    constructor(Roblox: RobloxSettings) {
        this.Roblox = Roblox;
    }

    overwriteRobloxColors(settings: RobloxSettings) {
        this.Roblox.nicknameColor = settings.nicknameColor;
        this.Roblox.donateAmmountColor = settings.donateAmmountColor;
        this.Roblox.messageColor = settings.messageColor;
        this.Roblox.textColor = settings.textColor;
    }
    overwriteRobloxFont(settings: RobloxSettings) {
        this.Roblox.fontFamily = settings.fontFamily;
        this.Roblox.fontSize = settings.fontSize;
    }

}

const defaultRobloxSettings: RobloxSettings = {
    nicknameColor: "#750DA8",
    donateAmmountColor: "#750DA8",
    messageColor: "#F00",
    textColor: "#fff",
    fontSize: 28,
    fontFamily: "Arial",
}

export default new Settings(defaultRobloxSettings);