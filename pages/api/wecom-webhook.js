import crypto from 'crypto';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 企业微信配置
const WECOM_TOKEN = process.env.WECOM_TOKEN;
const WECOM_ENCODING_AES_KEY = process.env.WECOM_ENCODING_AES_KEY;
const WECOM_CORP_ID = process.env.WECOM_CORP_ID;

// 验证企业微信消息真实性
function verifySignature(signature, timestamp, nonce, echostr) {
  const token = WECOM_TOKEN;
  const arr = [token, timestamp, nonce].sort();
  const str = arr.join('');
  const sha1 = crypto.createHash('sha1').update(str).digest('hex');
  return sha1 === signature;
}

// 解密企业微信消息（简化版）
function decryptMessage(encryptedMsg) {
  // 这里需要实现完整的 AES 解密
  // 由于企业微信的加密较复杂，建议使用官方 SDK
  return encryptedMsg;
}

// AI 回复消息
async function getAIReply(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个企业微信的 AI 助手。你用中文回答问题，简洁清晰，帮助员工解答基础问题。限制回复在 300 字以内。'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return '抱歉，我暂时无法处理您的问题，请稍后重试。';
  }
}

// 企业微信 API 发送消息
async function sendWeComMessage(toUser, content) {
  try {
    // 这里需要使用企业微信的 API
    // 需要获取 access_token，然后调用发送消息接口
    const token = await getWeComAccessToken();
    
    const response = await fetch('https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=' + token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        touser: toUser,
        msgtype: 'text',
        agentid: process.env.WECOM_AGENT_ID,
        text: { content: content }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Send WeChat message error:', error);
  }
}

// 获取企业微信 access_token
async function getWeComAccessToken() {
  try {
    const response = await fetch(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${process.env.WECOM_CORP_ID}&corpsecret=${process.env.WECOM_SECRET}`
    );
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Get access token error:', error);
  }
}

export default async function handler(req, res) {
  // GET 请求：验证服务器有效性
  if (req.method === 'GET') {
    const { signature, timestamp, nonce, echostr } = req.query;

    if (verifySignature(signature, timestamp, nonce, echostr)) {
      return res.status(200).send(echostr);
    } else {
      return res.status(403).json({ error: 'Invalid signature' });
    }
  }

  // POST 请求：处理企业微信消息
  if (req.method === 'POST') {
    const { signature, timestamp, nonce } = req.query;
    const body = req.body;

    // 验证消息真实性
    if (!verifySignature(signature, timestamp, nonce, '')) {
      return res.status(403).json({ error: 'Invalid signature' });
    }

    try {
      // 解析消息（这里简化处理，实际需要完整的 AES 解密）
      const fromUser = body.FromUserID || body.from_user_id;
      const content = body.Content || body.content;
      const msgType = body.MsgType || body.msg_type;

      console.log(`Received message from ${fromUser}: ${content}`);

      // 只处理文本消息
      if (msgType === 'text') {
        // 调用 AI 获取回复
        const aiReply = await getAIReply(content);

        // 发送回复给用户
        await sendWeComMessage(fromUser, aiReply);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}