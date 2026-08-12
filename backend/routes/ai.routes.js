import express from 'express';
import { query, dbType } from '../database/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate intelligent AI learning responses based on mode
function generateAIResponse(mode, message) {
  const clean = message.trim();

  if (mode === 'grammar') {
    return `### Grammar Analysis & Correction\n\n**Your Input:** "${clean}"\n\n**Improved Version:** "Here is how a native speaker would formulate it: '${clean.replace(/i /g, 'I ')}'."\n\n**Grammar Breakdown:**\n- **Word Choice:** Your expression is understandable!\n- **Fluency Tip:** Try using modal verbs (like *would*, *could*, *should*) for extra politeness in conversational English.\n- **XP Earned:** +10 Fluency Points for practicing grammar!`;
  }

  if (mode === 'vocab') {
    return `### Vocabulary Enhancer & Synonym Booster\n\n**Target Word/Phrase:** "${clean}"\n\n**Advanced Synonyms & Idioms:**\n1. **Sophisticated:** *Elaborate / Articulate*\n2. **Idiomatic:** *On the tip of my tongue*\n3. **Collocation:** *Make a remarkable impression*\n\n**Example Sentence:**\n> *"To speak fluently, one must consistently articulate ideas with clarity."*\n\n**Practice Challenge:** Try using one of these synonyms in your next speaking audio response!`;
  }

  if (mode === 'translator') {
    return `### Bilingual Translation & Expression Guide\n\n**Source Text:** "${clean}"\n\n**Natural English Translation:**\n> *"Learning English with Mahir Speaking opens up unlimited global career opportunities."*\n\n**Key Vocabulary Items:**\n- *Unlocks* = Membuka / memberikan akses\n- *Global Career* = Karir tingkat dunia\n- *Fluency* = Kelancaran berbicara`;
  }

  if (mode === 'speaking') {
    return `### Speaking Practice & Pronunciation Guide\n\n**Speaking Challenge Topic:** "${clean}"\n\n**Recommended Speech Structure (PREP Method):**\n1. **Point:** State your main opinion directly.\n2. **Reason:** Explain *why* you hold this view.\n3. **Example:** Share a brief personal experience.\n4. **Point:** Restate your conclusion confidently.\n\n**Pronunciation Focus:**\n- Watch out for the **/θ/** sound in *think*, *three*, and *thorough*.\n- Click the **Audio Voice Listener** button below to listen to the native pronunciation!`;
  }

  // Default General Conversation
  return `That's a fantastic point regarding **"${clean}"**!\n\nIn natural conversation, native English speakers often connect phrases smoothly using linking sounds. For example, instead of pausing between words, blend consonant and vowel sounds together.\n\nHow would you like to continue our conversation? You can ask me to correct your grammar, practice a mock job interview, or expand your vocabulary!`;
}

// Send Message to AI Chat
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    // Check user's package and usage limits
    const userResult = await query(
      `SELECT u.id, u.package_id, p.ai_daily_limit, p.name as package_name
       FROM users u
       JOIN packages p ON u.package_id = p.id
       WHERE u.id = ?`,
      [userId]
    );

    const userPkg = userResult[0];
    const dailyLimit = userPkg ? userPkg.ai_daily_limit : 10;

    // Check today's message count
    if (dailyLimit !== -1) {
      const todayCountResult = dbType === 'postgres'
        ? await query(
            `SELECT COUNT(*) as count FROM ai_chats 
             WHERE user_id = ? AND role = 'user' AND created_at::date = CURRENT_DATE`,
            [userId]
          )
        : await query(
            `SELECT COUNT(*) as count FROM ai_chats 
             WHERE user_id = ? AND role = 'user' AND DATE(created_at) = DATE('now')`,
            [userId]
          );
      const todayCount = todayCountResult[0]?.count || 0;

      if (todayCount >= dailyLimit) {
        return res.status(429).json({
          success: false,
          isLimitReached: true,
          message: `Daily AI Chat limit reached (${dailyLimit}/${dailyLimit} messages for ${userPkg.package_name} Plan). Please upgrade to Premium for UNLIMITED AI Speaking practice!`,
          package_name: userPkg.package_name
        });
      }
    }

    // Save user message
    await query(
      `INSERT INTO ai_chats (user_id, role, mode, content) VALUES (?, 'user', ?, ?)`,
      [userId, mode || 'general', message]
    );

    // Generate AI response
    const aiContent = generateAIResponse(mode || 'general', message);

    // Save assistant message
    const botResult = await query(
      `INSERT INTO ai_chats (user_id, role, mode, content) VALUES (?, 'assistant', ?, ?)`,
      [userId, mode || 'general', aiContent]
    );

    return res.json({
      success: true,
      userMessage: { role: 'user', content: message, mode },
      aiMessage: { id: botResult.lastID, role: 'assistant', content: aiContent, mode }
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({ success: false, message: 'AI Chat service error.' });
  }
});

// Get AI Chat History for user
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await query(
      `SELECT id, role, mode, content, created_at FROM ai_chats WHERE user_id = ? ORDER BY id ASC`,
      [req.user.id]
    );
    return res.json({ success: true, history });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch AI chat history.' });
  }
});

// Clear AI Chat History
router.delete('/history', verifyToken, async (req, res) => {
  try {
    await query(`DELETE FROM ai_chats WHERE user_id = ?`, [req.user.id]);
    return res.json({ success: true, message: 'Chat history cleared successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to clear history.' });
  }
});

export default router;
