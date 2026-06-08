'use server';
/**
 * @fileOverview A Genkit flow for sending professional Telegram notifications to the admin.
 * Supports both new newsletter subscriptions and new blog comments.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendTelegramNotificationInputSchema = z.object({
  type: z.enum(['subscription', 'comment']).describe('The type of notification.'),
  email: z.string().email().optional().describe('The email address of the new subscriber or commenter.'),
  authorName: z.string().optional().describe('The name of the comment author (for comments).'),
  postTitle: z.string().optional().describe('The title of the blog post (for comments).'),
  commentContent: z.string().optional().describe('The content of the comment (for comments).'),
  currentTime: z.string().optional().describe('Formatted current time.'),
});
export type SendTelegramNotificationInput = z.infer<typeof SendTelegramNotificationInputSchema>;

const SendTelegramNotificationOutputSchema = z.object({
  success: z.boolean().describe('Whether the notification was sent successfully.'),
  error: z.string().optional().describe('Error message if the notification failed.'),
});
export type SendTelegramNotificationOutput = z.infer<typeof SendTelegramNotificationOutputSchema>;

const notificationPrompt = ai.definePrompt({
  name: 'notificationPrompt',
  input: {schema: SendTelegramNotificationInputSchema},
  output: {schema: z.object({ formattedMessage: z.string() })},
  prompt: `You are a professional administrative assistant for ALIF Blog.
Create a clean and well-structured HTML notification message for Telegram using <b> for bold and <code> for code.

{{#if (eq type "subscription")}}
🔔 <b>New Subscriber Alert</b>

A new user has subscribed to <b>ALIF Blog</b>.

📧 Email: <code>{{{email}}}</code>
🕒 Time: {{{currentTime}}} (BST)

✅ Subscriber successfully added to the mailing list.

📈 Keep creating valuable content and grow your community!
{{else}}
💬 <b>New Comment Alert</b>

<b>Article:</b> {{{postTitle}}}
<b>Author:</b> {{{authorName}}}
<b>Email:</b> <code>{{{email}}}</code>

<b>Comment:</b>
<i>{{{commentContent}}}</i>

🕒 Time: {{{currentTime}}} (BST)
📋 Status: Pending Review
{{/if}}`,
});

/**
 * Wrapper function for sending notifications.
 */
export async function sendTelegramNotification(input: Omit<SendTelegramNotificationInput, 'currentTime'>): Promise<SendTelegramNotificationOutput> {
  const currentTimeBST = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return sendTelegramNotificationFlow({ 
    type: input.type,
    email: input.email,
    authorName: input.authorName,
    postTitle: input.postTitle,
    commentContent: input.commentContent,
    currentTime: currentTimeBST 
  });
}

const sendTelegramNotificationFlow = ai.defineFlow(
  {
    name: 'sendTelegramNotificationFlow',
    inputSchema: SendTelegramNotificationInputSchema,
    outputSchema: SendTelegramNotificationOutputSchema,
  },
  async input => {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId || chatId === 'YOUR_CHAT_ID_HERE') {
        console.error('Telegram configuration missing in Environment Variables.');
        return { success: false, error: 'Telegram Bot Token or Chat ID not configured.' };
      }

      let text = '';
      try {
        const { output } = await notificationPrompt(input);
        if (output?.formattedMessage) {
          text = output.formattedMessage;
        } else {
          throw new Error('AI failed to format message');
        }
} catch (aiError) {
  const notificationId = `ALIF-${Date.now()}`;

  text = input.type === 'subscription'
    ? `<b>ALIF BLOG • SUBSCRIPTION EVENT</b>

<b>Event: </b>
New Newsletter Subscription

<b>Subscriber: </b>
<code>${input.email}</code>

<b>Received At: </b>
${input.currentTime}

<b>Source</b>
ALIF Blog Website

<b>Status</b>
Successfully Added to Mailing List`
    : `<b>ALIF BLOG • COMMENT EVENT</b>


<b>Article</b>
${input.postTitle}

<b>Author</b>
${input.authorName}

<b>Email</b>
<code>${input.email ?? 'Not Provided'}</code>

<b>Comment</b>
${input.commentContent}

<b>Received At</b>
${input.currentTime} 

<b>Status</b>
Pending Moderation

<b>Action Required</b>
Review Comment from Admin Dashboard`;
}


      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API Error:', errorData);
        return { success: false, error: `Telegram error: ${errorData.description}` };
      }

      return { success: true };
    } catch (error: any) {
      console.error('sendTelegramNotificationFlow exception:', error);
      return { success: false, error: error.message };
    }
  }
);