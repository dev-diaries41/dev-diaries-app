import { z } from "zod";
import { defaultQuotePostSettings } from "./defaultSettings";

export const DrawTextParamsSchema = z.object({
    postText: z.string().min(1, "Post text is required and must be a non-empty string."),
    canvasWidth: z.number().default(defaultQuotePostSettings.canvasWidth).optional(),
    canvasHeight: z.number().default(defaultQuotePostSettings.canvasHeight).optional(),
    fontSize: z.number().default(defaultQuotePostSettings.fontSize).optional(),
    lineHeight: z.number().default(defaultQuotePostSettings.lineHeight).optional(),
    alignment: z.enum(['left', 'center', 'right']).default('left').optional()
});

