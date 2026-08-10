import { routing } from "./i18n/routing";
import enAbout from "./messages/en/about.json";
import enAdmin from "./messages/en/admin.json";
import enAuth from "./messages/en/auth.json";
import enButtons from "./messages/en/buttons.json";
import enEmployee from "./messages/en/employee.json";
import enForms from "./messages/en/forms.json";
import enHeader from "./messages/en/header.json";
import enHome from "./messages/en/home.json";
import enTabs from "./messages/en/tabs.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      home: typeof enHome;
      about: typeof enAbout;
      header: typeof enHeader;
      forms: typeof enForms;
      buttons: typeof enButtons;
      tabs: typeof enTabs;
      auth: typeof enAuth;
      employee: typeof enEmployee;
      admin: typeof enAdmin;
    };
  }
}
