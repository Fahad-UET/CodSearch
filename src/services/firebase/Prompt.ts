import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from 'firebase/firestore';
import { db } from './config';
const PROMPT_CATEGORIES = {
  'Product Search': {
    description: 'Prompts for product search and analysis',
    prompts: {
      'Generate Keywords Product Search': `Generate targeted search keywords for [Product] focusing on commercial intent and buyer behavior.
  
  Keyword Categories:
  1. Product Specifications
  - Brand names
  - Model numbers
  - Technical specs
  - Features
  - Variations
  
  2. Purchase Intent
  - Buy [Product]
  - Best [Product]
  - Top [Product]
  - [Product] price
  - [Product] review
  
  3. Problem-Solution
  - [Problem] solution
  - Fix [Problem]
  - Best for [Problem]
  - How to [Solution]
  - [Benefit] [Product]
  
  4. Comparison
  - [Product] vs
  - Alternative to [Product]
  - Better than [Product]
  - [Product] comparison
  - Best [Product] brand
  
  Format:
  - Group by intent
  - Include modifiers
  - Add locations
  - Price variations
  - Quality indicators`,

      'Find Similar Products Keywords': `Generate keywords to find products similar to [Product], focusing on alternatives and comparisons.
  
  Search Categories:
  1. Direct Comparisons
  - Like [Product]
  - Similar to [Product]
  - [Product] alternative
  - Instead of [Product]
  - Better than [Product]
  
  2. Feature Match
  - [Feature] like [Product]
  - Same as [Product]
  - [Product] equivalent
  - [Product] substitute
  - [Product] replacement
  
  3. Price Range
  - Cheaper than [Product]
  - [Product] price range
  - Affordable [Product]
  - Premium [Product]
  - Budget [Product]
  
  4. Quality Match
  - Quality like [Product]
  - [Product] grade
  - Professional [Product]
  - Consumer [Product]
  - Commercial [Product]`,

      'Translate Keywords': `Translate and localize keywords for [Target Language] while maintaining search intent and cultural relevance.
  
  Translation Guidelines:
  1. Maintain Intent
  - Keep commercial focus
  - Preserve urgency
  - Match user intent
  - Adapt CTAs
  - Keep benefits clear
  
  2. Cultural Adaptation
  - Local expressions
  - Cultural references
  - Regional variations
  - Market preferences
  - Local brands
  
  3. Language Specifics
  - Proper grammar
  - Natural phrasing
  - Local dialects
  - Common usage
  - Search patterns
  
  4. Technical Aspects
  - Character limits
  - Special characters
  - Diacritics
  - Word order
  - Punctuation
  
  Output Format:
  - Original keyword
  - Direct translation
  - Localized version
  - Search volume
  - Difficulty score`,
    },
  },

  'COD Search': {
    description: 'Prompts for Cash on Delivery product search and optimization',
    prompts: {
      'Product Search Assistant': `Help users find relevant products based on their specific needs and preferences.
  
  Search Parameters:
  1. Basic Information
  - Target market
  - Product category
  - Price range
  - Delivery options
  - Brand preferences
  
  2. User Context
  - Problem to solve
  - Use case
  - Experience level
  - Technical requirements
  - Environmental factors
  
  3. Quality Criteria
  - Durability
  - Performance
  - Reliability
  - Warranty
  - Support
  
  4. Purchase Factors
  - Budget constraints
  - Urgency level
  - Local availability
  - Payment options
  - Shipping requirements
  
  Output Format:
  - Product suggestions
  - Key features
  - Price comparisons
  - Availability info
  - Purchase options`,

      'Find Similar Products Keywords': `Generate keywords to find products similar to [Product], focusing on alternatives and comparisons.
  
  Search Categories:
  1. Direct Comparisons
  - Like [Product]
  - Similar to [Product]
  - [Product] alternative
  - Instead of [Product]
  - Better than [Product]
  
  2. Feature Match
  - [Feature] like [Product]
  - Same as [Product]
  - [Product] equivalent
  - [Product] substitute
  - [Product] replacement
  
  3. Price Range
  - Cheaper than [Product]
  - [Product] price range
  - Affordable [Product]
  - Premium [Product]
  - Budget [Product]
  
  4. Quality Match
  - Quality like [Product]
  - [Product] grade
  - Professional [Product]
  - Consumer [Product]
  - Commercial [Product]`,

      'Translate Keywords': `Translate and localize keywords for [Target Language] while maintaining search intent and cultural relevance.
  
  Translation Guidelines:
  1. Maintain Intent
  - Keep commercial focus
  - Preserve urgency
  - Match user intent
  - Adapt CTAs
  - Keep benefits clear
  
  2. Cultural Adaptation
  - Local expressions
  - Cultural references
  - Regional variations
  - Market preferences
  - Local brands
  
  3. Language Specifics
  - Proper grammar
  - Natural phrasing
  - Local dialects
  - Common usage
  - Search patterns
  
  4. Technical Aspects
  - Character limits
  - Special characters
  - Diacritics
  - Word order
  - Punctuation
  
  Output Format:
  - Original keyword
  - Direct translation
  - Localized version
  - Search volume
  - Difficulty score`,
    },
  },
  'Content Generation': {
    description: 'Prompts for generating marketing and advertising content',
    prompts: {
      'Ad Copy Prompt Template': `Act as an expert copywriter specializing in persuasive ad copy. Create compelling and engaging ad copy that drives action while maintaining authenticity and cultural relevance.
  
  Key Requirements:
  1. Use natural language and common expressions
  2. Adapt tone to match the target audience
  3. Include emotional triggers and pain points
  4. Maintain cultural sensitivity
  5. Focus on benefits over features
  6. Create urgency without being aggressive
  7. Use social proof elements
  8. Include clear calls-to-action
  
  Format:
  - Start with an attention-grabbing hook
  - Present the problem/pain point
  - Introduce the solution (product)
  - Highlight key benefits
  - Add social proof elements
  - End with a clear call-to-action
  
  Tone Guidelines:
  - Conversational and authentic
  - Confident but not pushy
  - Empathetic and understanding
  - Professional yet approachable`,

      'Customer Reviews Prompt Template': `Generate authentic and credible customer reviews that highlight real experiences with the product. Each review should feel genuine and focus on specific benefits and results.
  
  Guidelines:
  1. Vary writing styles and tones
  2. Include specific details about product usage
  3. Mention both pros and minor cons for authenticity
  4. Use realistic timeframes for results
  5. Include relevant context (age, situation, etc.)
  6. Maintain natural language patterns
  7. Avoid overly promotional language
  8. Include realistic star ratings
  
  Review Structure:
  - Initial impression
  - Usage experience
  - Specific results
  - Comparison to alternatives
  - Recommendation
  - Star rating (1-5)
  
  Authenticity Markers:
  - Personal context
  - Specific details
  - Natural language
  - Balanced perspective
  - Realistic timeframes
  - Genuine emotions`,

      'Landing Page Text Prompt Template': `Create compelling landing page copy that converts visitors into customers. Focus on clear value propositions and persuasive content structure.
  
  Page Sections:
  1. Hero Section
  - Headline (clear value proposition)
  - Subheadline (supporting statement)
  - Primary CTA
  
  2. Problem Statement
  - Pain points
  - Current challenges
  - Market gaps
  
  3. Solution/Benefits
  - Key features
  - Primary benefits
  - Unique advantages
  
  4. Social Proof
  - Customer testimonials
  - Trust indicators
  - Results/statistics
  
  5. Product Details
  - Specifications
  - Use cases
  - Technical details
  
  6. FAQs
  - Common questions
  - Objection handling
  - Support information
  
  7. Closing Section
  - Final CTA
  - Guarantee/Risk reversal
  - Contact information
  
  Writing Guidelines:
  - Clear and concise language
  - Scannable format
  - Benefit-focused content
  - Strong CTAs
  - SEO-optimized headings
  - Mobile-friendly structure`,
    },
  },

  'Voice Over': {
    description: 'Prompts for generating voice over scripts',
    prompts: {
      'Review Voice Prompt Template': `Create natural, conversational voice-over scripts for product reviews that feel authentic and trustworthy.
  
  Script Guidelines:
  1. Natural Speech Patterns
  - Use contractions
  - Include pauses and filler words
  - Vary sentence length
  - Add personality markers
  
  2. Review Structure
  - Personal introduction
  - Problem description
  - Product discovery
  - Usage experience
  - Results and benefits
  - Recommendation
  
  3. Authenticity Elements
  - Personal anecdotes
  - Specific details
  - Balanced perspective
  - Natural transitions
  - Realistic timeframes
  
  4. Technical Specs
  - 30-60 second duration
  - Clear pronunciation
  - Natural pacing
  - Emotional variation
  - Breathing spaces
  
  Language Style:
  - Conversational tone
  - Simple vocabulary
  - Short sentences
  - Active voice
  - Personal pronouns`,

      'Creative Voice Prompt Template': `Generate engaging and creative voice-over scripts that capture attention and drive engagement.
  
  Script Elements:
  1. Hook (5 seconds)
  - Attention-grabbing opener
  - Question or statement
  - Pattern interrupt
  
  2. Problem (10 seconds)
  - Relatable situation
  - Pain point
  - Emotional connection
  
  3. Solution (10 seconds)
  - Product introduction
  - Key benefits
  - Unique features
  
  4. Proof (10 seconds)
  - Results
  - Social proof
  - Demonstrations
  
  5. Call to Action (5 seconds)
  - Clear instruction
  - Sense of urgency
  - Next steps
  
  Technical Guidelines:
  - 30-45 second duration
  - Natural speech patterns
  - Emotional variation
  - Strategic pauses
  - Clear pronunciation
  
  Style Requirements:
  - Engaging tone
  - Storytelling elements
  - Persuasive language
  - Natural transitions
  - Authentic delivery`,
    },
  },

  'Marketing Research': {
    description: 'Prompts for market research and product analysis',
    prompts: {
      'Marketing Lists Generation': `Give me:
  • 10 different marketing angles for the following product: [Product]. Each angle should be a short, compelling hook that highlights a unique selling point, such as quality, affordability, durability, convenience, innovation, or customer satisfaction. The angles should be engaging, persuasive, and create a sense of urgency or desire, making the product stand out and appealing to potential buyers.
  • 10 problems this product solves. These should be real-life issues or inconveniences that the product helps to eliminate or improve, emphasizing the product's practical benefits.
  • 10 pain points that potential customers experience before using this product. These should focus on frustrations, challenges, or inefficiencies that make customers seek a solution like this.
  • 10 brand name ideas for this product. The names should be catchy, relevant, and aligned with the product's purpose and audience.
  
  Format the response in clear sections with one item per line. No numbering or bullet points.`,
    },
  },
};

export const storePromptCategories = async () => {
  try {
    const promptsRef = collection(db, 'prompts');
    const snapshot = await getDocs(promptsRef);
    const existingCategories = snapshot.docs.map(doc => ({ data: doc.data(), id: doc.id }));
    if (existingCategories.length > 0) {
      return { ...existingCategories[0] };
    }
    const docRef = await addDoc(promptsRef, PROMPT_CATEGORIES);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, data: docSnap.data() };
  } catch (error) {
    console.error('Error storing prompt categories:', error);
  }
};

const reconstructPrompt = (prompt: any) => {
  const reconstructedObject = prompt.reduce((acc: any, prompt: any) => {
    const { category, name, content } = prompt;
    // Initialize the category if it doesn't exist
    if (!acc[category]) {
      acc[category] = {
        description: PROMPT_CATEGORIES[category].description, // Add the description if available
        prompts: {},
      };
    }
    // Add the prompt to the category
    acc[category].prompts[name] = content;
    return acc;
  }, {});

  return reconstructedObject;
};

export const updatePromptCategories = async (prompt: any) => {
  try {
    const reconstructedObject = reconstructPrompt(prompt);
    const promptsRef = collection(db, 'prompts');
    const snapshot = await getDocs(promptsRef);
    const existingCategories = snapshot.docs.map(doc => ({ data: doc.data(), id: doc.id }));

    if (existingCategories.length === 0) {
      return { success: false, message: 'No prompt categories found.' };
    }
    const { id } = existingCategories[0];
    const docRef = doc(promptsRef, id);
    // Use setDoc with merge: true to ensure it updates the document correctly
    await setDoc(docRef, reconstructedObject, { merge: true });

    return { success: true, message: 'Prompt updated successfully.', data: reconstructedObject };
  } catch (error) {
    console.error('Error updating prompt categories:', error);
    return { success: false, message: 'Error updating prompt categories.' };
  }
};
