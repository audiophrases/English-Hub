const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/English Hub/index.html', 'utf8');

const newUnits = `[
            {
                id: 1,
                title: "Warm Up & Back to School",
                shortTitle: "Warm Up",
                theme: "amber",
                gradient: "from-amber-400 to-orange-500",
                icon: "book",
                grammar: "Basic review (Past tenses, present simple)",
                vocab: [
                    { term: "passport", def: "passaport", example: "We use the English passport to track our progress." },
                    { term: "expectations", def: "expectatives", example: "What are your expectations for this year?" },
                    { term: "goals", def: "objectius", example: "Set some goals to improve your fluency." }
                ],
                student: {
                    repte: "Welcome back! Let's set our goals for the year, break the ice, and share our summer memories.",
                    products: [
                        { type: "Written Task", desc: "A Summer Memory Writing: attach a picture from your holidays and write about it." },
                        { type: "English Passport", desc: "Mark in the passport where you think your knowledge is located." }
                    ]
                },
                teacher: {
                    repte: "Establish classroom routines, set expectations, and conduct initial diagnostic assessments.",
                    competencies: "Competència Específica 1 (Oral reception) and 3 (Oral production).",
                    methodology: "Ice-breakers, diagnostic testing, collaborative goal setting.",
                    assessment: "Diagnostic, non-graded feedback to gauge initial level."
                }
            },
            {
                id: 2,
                title: "Personality, Advertising and Shopping",
                shortTitle: "Personality & Ads",
                theme: "rose",
                gradient: "from-rose-400 to-pink-500",
                icon: "shopping-bag",
                grammar: "Past Simple, Past Continuous, Used to, Past Perfect",
                vocab: [
                    { term: "personality", def: "personalitat", example: "She has a very outgoing personality." },
                    { term: "advertising", def: "publicitat", example: "Advertising influences what we buy." },
                    { term: "shopping", def: "compres", example: "Online shopping is very popular." },
                    { term: "influencer", def: "creador de tendències", example: "The influencer promoted a new brand." },
                    { term: "customer review", def: "ressenya de client", example: "Read the customer review before buying." }
                ],
                student: {
                    repte: "Explore how advertising affects us and learn to describe personalities and shopping habits.",
                    products: [
                        { type: "Written Task", desc: "Write a Customer Review evaluating a product or service." },
                        { type: "Reading Task", desc: "Read 'The Rise of the Influencer' and answer the questions." },
                        { type: "TOD & Speaking", desc: "Complete the Grammar review stations and discuss short spooky films." }
                    ]
                },
                teacher: {
                    repte: "Develop critical thinking regarding media and consumerism, while consolidating narrative past tenses.",
                    competencies: "Competència Específica 2 (Written reception) and 5 (Written production).",
                    methodology: "Station-based learning (TOD), critical reading, peer editing.",
                    assessment: "Accuracy of narrative tenses in the review, reading comprehension."
                }
            },
            {
                id: 3,
                title: "Nutrition, Well-Being, Aches and Pains",
                shortTitle: "Health",
                theme: "emerald",
                gradient: "from-emerald-400 to-teal-500",
                icon: "heart-pulse",
                grammar: "Present Simple vs Continuous, Modals",
                vocab: [
                    { term: "nutrition", def: "nutrició", example: "Good nutrition is essential for growth." },
                    { term: "well-being", def: "benestar", example: "Focus on your mental well-being." },
                    { term: "aches", def: "malestars", example: "He has aches after playing sports." },
                    { term: "pains", def: "dolors", example: "She felt pains in her stomach." },
                    { term: "diet", def: "dieta", example: "A balanced diet is very important." }
                ],
                student: {
                    repte: "Focus on your wellbeing! Learn about nutrition, design healthy routines, and express your opinions.",
                    products: [
                        { type: "Written Task", desc: "Write an Opinion Essay about health and lifestyle." },
                        { type: "TOD 2", desc: "Design a weekly meal plan focusing on nutrition and wellbeing." },
                        { type: "Speaking Game", desc: "Play Boom!! / 1, 2, 3... Speak! to practice fluency." }
                    ]
                },
                teacher: {
                    repte: "Promote healthy habits and metacognitive reflection on personal well-being, practicing modals of advice.",
                    competencies: "Personal, social i d’aprendre a aprendre (CPSAA 5), Llengua Estrangera 5.",
                    methodology: "Gamification (Boom!), project-based learning (meal plan), essay structuring.",
                    assessment: "Cohesion in opinion essays, oral fluency during games, proper use of modals."
                }
            },
            {
                id: 4,
                title: "News, Utopia, Education and Careers",
                shortTitle: "News & Future",
                theme: "blue",
                gradient: "from-blue-400 to-indigo-500",
                icon: "globe",
                grammar: "Future Tenses",
                vocab: [
                    { term: "news", def: "notícies", example: "Did you watch the news today?" },
                    { term: "utopia", def: "utopia", example: "An ideal society is a utopia." },
                    { term: "senses", def: "sentits", example: "We have five basic senses." },
                    { term: "education", def: "educació", example: "Education is the key to success." },
                    { term: "careers", def: "carreres professionals", example: "They discussed their future careers." }
                ],
                student: {
                    repte: "Analyze current events, envision ideal societies, and plan your future education and career.",
                    products: [
                        { type: "Written Task", desc: "Write a Report Practice based on a questionnaire." },
                        { type: "Listening Task", desc: "Complete the Unit 3 Listening Test and practice." },
                        { type: "TOD 3", desc: "Choose a Youtube video (challenge, tag, unboxing) and analyze it." }
                    ]
                },
                teacher: {
                    repte: "Students explore societal issues and future educational trajectories, developing vocabulary to express hypotheses.",
                    competencies: "Ciutadana (CC1), Llengua Estrangera 3 (Oral) and 5 (Written).",
                    methodology: "Inquiry-based learning, media literacy (YouTube analysis), formal report writing.",
                    assessment: "Ability to extract main ideas from audio, formal register in reports."
                }
            },
            {
                id: 5,
                title: "Protest, Reporting and Entertainment",
                shortTitle: "Protest & Media",
                theme: "purple",
                gradient: "from-purple-400 to-violet-500",
                icon: "megaphone",
                grammar: "Conditionals",
                vocab: [
                    { term: "protest", def: "protesta", example: "The protest was peaceful." },
                    { term: "reporting", def: "reportatge", example: "Journalists are reporting live." },
                    { term: "entertainment", def: "entreteniment", example: "Movies are a form of entertainment." },
                    { term: "social media", def: "xarxes socials", example: "Social media connects people." }
                ],
                student: {
                    repte: "Understand the power of reporting and protests, and explore the entertainment industry.",
                    products: [
                        { type: "Listening Task", desc: "Listen to the opening scene of 'The Lord of the Rings' and fill in the gaps." },
                        { type: "TOD 4", desc: "Complete the Conditionals Learning Stations." },
                        { type: "Reading Task", desc: "Complete the Comp. Bàsiques Practice." }
                    ]
                },
                teacher: {
                    repte: "Develop critical awareness of media and civic action, utilizing complex conditional structures.",
                    competencies: "Ciutadana (CC2), Llengua Estrangera 2 & 4.",
                    methodology: "Station-based learning (Conditionals), multimedia listening, standardized test practice.",
                    assessment: "Accurate use of conditionals, listening comprehension of authentic materials."
                }
            },
            {
                id: 6,
                title: "Final Evaluations and Presentations",
                shortTitle: "Finals",
                theme: "slate",
                gradient: "from-slate-700 to-slate-900",
                icon: "award",
                grammar: "Comprehensive Review",
                vocab: [
                    { term: "presentation", def: "presentació", example: "She gave a great presentation." },
                    { term: "fluency", def: "fluïdesa", example: "Practice speaking to improve your fluency." },
                    { term: "accuracy", def: "precisió", example: "Check your grammar for accuracy." },
                    { term: "comprehension", def: "comprensió", example: "The test measures reading comprehension." }
                ],
                student: {
                    repte: "Show everything you've learned this year! Prepare for your final exams and your oral presentation.",
                    products: [
                        { type: "Oral Task", desc: "A One minute talk that counts as 10% of the final mark." },
                        { type: "Proves Finals", desc: "Complete the Final Oral Comprehension and Reading Comprehension exams." }
                    ]
                },
                teacher: {
                    repte: "Consolidate the year's learning and conduct final summative assessments across all skills.",
                    competencies: "All Competències Específiques.",
                    methodology: "Summative assessment, oral presentations, standardized testing.",
                    assessment: "Final mastery of 4th ESO objectives, oral fluency, reading and listening comprehension."
                }
            }
        ]`;

const regex = /const units = \[[\s\S]*?\];/;
const updatedContent = content.replace(regex, 'const units = ' + newUnits + ';');

if(updatedContent === content) {
    console.error('Failed to replace! Regex might be wrong.');
} else {
    fs.writeFileSync('C:/Users/Admin/English Hub/index.html', updatedContent);
    console.log('Successfully updated index.html with new units.');
}
