import { AlignmentType, CreateType } from "./types";

// time units in seconds
const sec = 60;
const min = 60 * sec;
const hour = 60 * min;
const day = 24 * hour;
const week = 7 * day;

export const Time = {
  sec,
  min,
  hour,
  day,
  week,
}

const default_negative_prompt = "disfigured mouth, disfigured teeth, half head, half face, blury, side looking, old, wrinkle, child, no face, pencil, full body, sharp, far away, overlapping, duplication, nude, disfigured, kitsch, oversaturated, grain, low-res, Deformed, blurry, bad anatomy, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long body, disgusting, poorly drawn, childish, mutilated, mangled, surreal, out of frame, duplicate, 2 faces";

export const defaultImageSettings = {
    negative_prompt: default_negative_prompt,
    num_steps: 100,
    guidance_scale: 4,
    sampler: "ddim",
    prior_cf_scale: 4,
    prior_steps: "5",
    num_images: 1,
    seed: -1,
    h:768,
    w:768,
}

export const defaultQuotePostSettings = {
  canvasHeight: 1000,
  canvasWidth: 1000,
  lineHeight: 70,
  fontSize: 60,
  alignment: 'left' as AlignmentType
}

export const DEFAULT_SETTINGS ={
    enablePasscode: false,
    theme:"dark",
    
    broadcastSettings:{
        telegramChannelId: '',
        discordWebhookUrl: '',
    },

    imageSettings: defaultImageSettings,

    quotePostSettings: defaultQuotePostSettings,
  }

  export const PLACEHOLDER_TAGS = [
    {tagName: 'dev_diaries'},
    {tagName: 'tasks'},
    {tagName: 'app_idea'},
    {tagName: 'business_idea'},
    {tagName: 'articles'},
] 

  export const cronTimeOptions = [
    { duration: '1 minute', cron: '*/1 * * * *' },
    { duration: '5 minutes', cron: '*/5 * * * *' },
    { duration: '15 minutes', cron: '*/15 * * * *' },
    { duration: '30 minutes', cron: '*/30 * * * *' },
    { duration: '1 hour', cron: '0 */1 * * *' },
    { duration: '6 hours', cron: '0 */6 * * *' },
    { duration: '1 day', cron: '0 0 */1 * *' },
    { duration: '1 week', cron: '0 0 * * 0' },
    { duration: '1 month', cron: '0 0 1 */1 *' },
  ];

  export const availableTasks = [
    'notify',
    'articles',
  ]