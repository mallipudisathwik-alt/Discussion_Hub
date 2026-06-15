const axios = require('axios');
const DiscussionEmbedding = require('../models/DiscussionEmbedding');

exports.search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter q is required' });

    let results;

    try {
      const embedResp = await axios.post(`${process.env.EMBEDDING_SERVICE_URL}/embed`, { text: query });
      const embedding = embedResp.data.embedding;

      results = await DiscussionEmbedding.aggregate([
        {
          $vectorSearch: {
            queryVector: embedding,
            path: 'embedding',
            numCandidates: 100,
            limit: 10,
            index: 'vector_index'
          }
        },
        {
          $addFields: {
            score: { $meta: 'vectorSearchScore' }
          }
        }
      ]);
    } catch (vectorErr) {
      console.warn('Vector search failed, falling back to text search:', vectorErr.message);
      const regex = new RegExp(query, 'i');
      results = await DiscussionEmbedding.find({
        $or: [
          { title: regex },
          { category: regex },
          { tags: regex },
          { content_snippet: regex }
        ]
      }).limit(10).lean();
      results = results.map((r) => ({ ...r, score: 0.5 }));
    }

    res.json(results);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
};
