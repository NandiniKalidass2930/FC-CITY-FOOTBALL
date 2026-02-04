import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";

import { playerType } from "./playerType";
import { coachType } from "./coachType";
import { trainerType } from "./trainerType";

import { heroType } from "./heroType";
import { sponsorType } from "./sponsorType";
import { aboutType } from "./aboutType";
import { teamPageType } from "./teamPageType";
import { galleryType } from "./galleryType";
import { trainingPageType } from "./trainingPageType";

import { contactPageType } from "./contactPageType";
import { contactMessageType } from "./contactMessageType";
import { siteSettingsType } from "./siteSettingsType";
import { faqType } from "./faqType";
import { footerType } from "./footerType";
import { localeString, localeText } from "./localeString";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,

    localeString,
    localeText,
    playerType,
    coachType,
    trainerType,
    heroType,
    sponsorType,
    aboutType,
    teamPageType,
    galleryType,
    trainingPageType,
    
    contactPageType,
    contactMessageType,
    siteSettingsType,
    faqType,
    footerType,
  ],
};
