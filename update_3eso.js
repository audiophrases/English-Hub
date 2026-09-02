const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/English Hub/3ESO/index.html', 'utf8');

const newUnits = `[
            {
                id: 1,
                title: "Happiness & Feelings",
                shortTitle: "Happiness",
                theme: "amber",
                gradient: "from-amber-400 to-orange-500",
                icon: "smile",
                grammar: "Past Simple vs Past Continuous",
                vocab: [
                    { term: "happiness", def: "felicitat", example: "Happiness is important for your health." },
                    { term: "behaviour", def: "comportament", example: "His behaviour was excellent." },
                    { term: "feeling", def: "sentiment", example: "She had a strong feeling of joy." },
                    { term: "helping", def: "ajudar", example: "Helping others makes you feel good." },
                    { term: "spooky", def: "esgarrifós", example: "That was a very spooky story!" }
                ],
                student: {
                    repte: "Explore what happiness means to you, talk about past experiences, and invent a spooky tale.",
                    products: [
                        { type: "Written Task", desc: "Spooky Tales: Invent a horror story." },
                        { type: "Speaking Task", desc: "Speaking about the past: share experiences." },
                        { type: "TOD", desc: "Find Someone Who: Play the game speaking only in English." }
                    ]
                },
                teacher: {
                    repte: "Establish initial routines and assess narrative tenses through engaging topics like happiness and Halloween.",
                    competencies: "Competència Específica 1 and 5.",
                    methodology: "Gamification, creative writing, peer interaction.",
                    assessment: "Accuracy of past tenses, fluency in spoken games."
                }
            },
            {
                id: 2,
                title: "Stories, Books & Films",
                shortTitle: "Stories & Films",
                theme: "rose",
                gradient: "from-rose-400 to-pink-500",
                icon: "film",
                grammar: "Present Perfect",
                vocab: [
                    { term: "opinion", def: "opinió", example: "What is your opinion on this book?" },
                    { term: "archetype", def: "arquetip", example: "The hero is a common archetype." },
                    { term: "plot", def: "argument", example: "The plot of the movie was very interesting." },
                    { term: "comic strip", def: "tira còmica", example: "I love reading this comic strip." },
                    { term: "character", def: "personatge", example: "Who is your favourite character?" }
                ],
                student: {
                    repte: "Dive into the world of stories! Review your favourite films and create your own comic strip.",
                    products: [
                        { type: "Speaking Task", desc: "My Favourite Film Presentation." },
                        { type: "Creative Task", desc: "Comic strip creation." },
                        { type: "Listening Task", desc: "Fantastic Beasts trailer listening." }
                    ]
                },
                teacher: {
                    repte: "Develop students' ability to narrate life experiences and express opinions on media.",
                    competencies: "Competència Específica 3 and 4.",
                    methodology: "Oral presentations, multimodal creation (comics), active listening.",
                    assessment: "Oral fluency, proper usage of Present Perfect."
                }
            },
            {
                id: 3,
                title: "Choices, Money & Adventure",
                shortTitle: "Choices",
                theme: "emerald",
                gradient: "from-emerald-400 to-teal-500",
                icon: "compass",
                grammar: "Review of Present and Past Tenses",
                vocab: [
                    { term: "choice", def: "elecció", example: "You have to make a choice." },
                    { term: "money", def: "diners", example: "How much money do you need?" },
                    { term: "shopping", def: "compres", example: "Let's go shopping!" },
                    { term: "adventure", def: "aventura", example: "It was a great adventure." },
                    { term: "bargain", def: "ganga", example: "This jacket was a real bargain." }
                ],
                student: {
                    repte: "Make choices, manage money, and embark on adventures while preparing for the holidays.",
                    products: [
                        { type: "TOD Project", desc: "Create your own Board Game." },
                        { type: "Challenge", desc: "30 Days Happiness Challenge." },
                        { type: "Music Task", desc: "My Playlist: Create a 10 songs playlist." }
                    ]
                },
                teacher: {
                    repte: "Encourage autonomous learning and decision making through project-based tasks.",
                    competencies: "Competència Específica 5 and Personal/Social.",
                    methodology: "Project-based learning (Board Games), self-reflection.",
                    assessment: "Creativity, collaboration in pairs, grammatical accuracy in instructions."
                }
            },
            {
                id: 4,
                title: "Communication & Technology",
                shortTitle: "Communication",
                theme: "blue",
                gradient: "from-blue-400 to-indigo-500",
                icon: "smartphone",
                grammar: "Modal Verbs",
                vocab: [
                    { term: "communication", def: "comunicació", example: "Communication is key in a relationship." },
                    { term: "technology", def: "tecnologia", example: "Technology changes very fast." },
                    { term: "trailer", def: "tràiler", example: "I saw the movie trailer online." },
                    { term: "translation", def: "traducció", example: "This translation is incorrect." },
                    { term: "device", def: "dispositiu", example: "Please turn off your device." }
                ],
                student: {
                    repte: "Explore how we communicate in the modern world and learn to give advice using modals.",
                    products: [
                        { type: "Listening Task", desc: "Movie Trailers: Listen and fill in the gaps." },
                        { type: "Reading Task", desc: "Lost in translation! Read and answer." },
                        { type: "TOD", desc: "Modal verbs review exercises." }
                    ]
                },
                teacher: {
                    repte: "Enhance digital literacy and the ability to express obligation, permission, and advice.",
                    competencies: "Competència Digital and Llengua Estrangera 1.",
                    methodology: "Authentic materials listening, grammar in context.",
                    assessment: "Listening comprehension, accurate use of modal verbs."
                }
            },
            {
                id: 5,
                title: "Crime & Biographies",
                shortTitle: "Crime & Bio",
                theme: "purple",
                gradient: "from-purple-400 to-violet-500",
                icon: "search",
                grammar: "Relative Pronouns & Modal Verbs",
                vocab: [
                    { term: "crime", def: "crim", example: "The detective solved the crime." },
                    { term: "biography", def: "biografia", example: "I read a biography of a famous writer." },
                    { term: "author", def: "autor", example: "Who is the author of this book?" },
                    { term: "justice", def: "justícia", example: "They demanded justice." },
                    { term: "clue", def: "pista", example: "He found a clue at the scene." }
                ],
                student: {
                    repte: "Investigate crimes and learn about famous British and American writers.",
                    products: [
                        { type: "Project", desc: "British and American writers - Biographical project." },
                        { type: "Reading Task", desc: "A second chance: Read and complete the form." },
                        { type: "Writing Task", desc: "Crime writing photocopy." }
                    ]
                },
                teacher: {
                    repte: "Integrate literature and culture with language learning through biographical research.",
                    competencies: "Competència Específica 6 (Plurilingual/Intercultural).",
                    methodology: "Research project, extensive reading, guided writing.",
                    assessment: "Research skills, synthesis of information, correct use of relative clauses."
                }
            },
            {
                id: 6,
                title: "Final Challenges & Music",
                shortTitle: "Finals",
                theme: "slate",
                gradient: "from-slate-700 to-slate-900",
                icon: "music",
                grammar: "Comprehensive Review",
                vocab: [
                    { term: "festival", def: "festival", example: "We went to a music festival." },
                    { term: "billboard", def: "cartellera", example: "Look at the billboard for the concert." },
                    { term: "review", def: "repàs", example: "Let's do a quick grammar review." },
                    { term: "comprehension", def: "comprensió", example: "Reading comprehension is very important." }
                ],
                student: {
                    repte: "Show off your skills! Design a music festival and ace your final exams.",
                    products: [
                        { type: "Creative Task", desc: "The Music Festival of your Dreams: Design a billboard." },
                        { type: "Exams", desc: "Proves Finals: Reading and Listening Comprehension." }
                    ]
                },
                teacher: {
                    repte: "Consolidate learning and assess overall competency levels at the end of the year.",
                    competencies: "All Competències Específiques.",
                    methodology: "Summative assessment, creative wrap-up activities.",
                    assessment: "Final mastery of 3rd ESO objectives."
                }
            }
        ]`;

let updatedContent = content.replace(/<title>4th ESO English Syllabus<\/title>/, '<title>3rd ESO English Syllabus</title>');
updatedContent = updatedContent.replace(/<h1 class="font-bold text-xl tracking-tight hidden sm:block">4th ESO English<\/h1>/, '<h1 class="font-bold text-xl tracking-tight hidden sm:block">3rd ESO English</h1>');

const regex = /const units = \[[\s\S]*?\];/;
updatedContent = updatedContent.replace(regex, 'const units = ' + newUnits + ';');

if(updatedContent === content) {
    console.error('Failed to replace content! Regex might be wrong.');
} else {
    fs.writeFileSync('C:/Users/Admin/English Hub/3ESO/index.html', updatedContent);
    console.log('Successfully updated 3ESO/index.html.');
}
