import { BookOpen, Phone, Globe, Heart, Shield, Users, ArrowRight, X, ExternalLink, MapPin, Star, NotebookPen } from "lucide-react";
import { useState } from "react";

const Resources = () => {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [bookNotes, setBookNotes] = useState<{[key: string]: string}>({});

  const books = [
    {
      id: "anxiety-self-help-guide",
      title: "Anxiety Self-Help Guide",
      author: "Dr. Sarah Mitchell",
      description: "A comprehensive guide to understanding and managing anxiety naturally",
      fullDescription: "This free guide provides evidence-based techniques for managing anxiety without medication. Written by a licensed therapist, it combines cognitive behavioral strategies with mindfulness practices to help you regain control over anxious thoughts and feelings.",
      keyConceptsHeading: "Key Therapeutic Concepts:",
      keyConcepts: [
        "Understanding anxiety triggers",
        "Breathing and grounding techniques",
        "Cognitive restructuring basics",
        "Progressive muscle relaxation",
        "Building resilience and confidence",
        "Creating anxiety action plans"
      ],
      chapters: [
        {
          number: 1,
          title: "Understanding Your Anxiety",
          content: `Anxiety is one of the most common mental health challenges, affecting millions of people worldwide. But what exactly is anxiety, and why does it happen?

At its core, anxiety is your body's natural alarm system. When your brain perceives a threat—real or imagined—it triggers a cascade of physical and emotional responses designed to keep you safe. Your heart races, your breathing quickens, and your muscles tense up, preparing you for action.

This response, known as "fight or flight," served our ancestors well when facing physical dangers like wild animals. However, in our modern world, this same system can be triggered by everyday stressors: work deadlines, social situations, financial concerns, or even our own thoughts.

The key insight is this: anxiety itself isn't the enemy. It's a normal human emotion that becomes problematic only when it's disproportionate to the actual threat or when it interferes with your daily life.

Common signs of anxiety include:
- Racing thoughts or constant worry
- Physical symptoms like sweating, trembling, or nausea
- Avoidance of certain situations or places
- Difficulty concentrating or making decisions
- Sleep disturbances
- Irritability or restlessness

Understanding that anxiety is a natural response—and that you're not "broken" or "weak" for experiencing it—is the first step toward managing it effectively. In the following chapters, we'll explore practical techniques that can help you work with your anxiety rather than against it.

Remember: You have more control over your anxiety than you might think. With the right tools and practice, you can learn to manage anxious thoughts and feelings, allowing you to live a fuller, more confident life.`
        },
        {
          number: 2,
          title: "The Power of Breathing",
          content: `One of the most powerful and immediate tools for managing anxiety is something you do automatically every moment of your life: breathing. When anxiety strikes, our breathing often becomes shallow and rapid, which can actually increase feelings of panic and distress.

The good news? By consciously changing how you breathe, you can send a direct signal to your nervous system to calm down. This isn't just wishful thinking—it's backed by solid science.

**The 4-7-8 Breathing Technique:**

This simple but effective technique can help you regain control during anxious moments:

1. Exhale completely through your mouth
2. Close your mouth and inhale through your nose for 4 counts
3. Hold your breath for 7 counts
4. Exhale through your mouth for 8 counts
5. Repeat 3-4 times

**Box Breathing:**

Used by Navy SEALs and emergency responders, this technique creates a sense of calm and focus:

1. Inhale for 4 counts
2. Hold for 4 counts
3. Exhale for 4 counts
4. Hold empty for 4 counts
5. Repeat for 2-5 minutes

**Belly Breathing:**

Place one hand on your chest and one on your belly. Breathe so that only the hand on your belly moves. This engages your diaphragm and activates your body's relaxation response.

**When to Use Breathing Techniques:**

- At the first sign of anxiety
- Before stressful situations (meetings, social events)
- When you wake up feeling anxious
- As a daily practice to build resilience

The beauty of breathing techniques is that they're always available to you. No one even needs to know you're doing them. Whether you're in a crowded room or lying in bed at 3 AM, your breath is your constant companion and your pathway to calm.

Practice these techniques when you're calm so they become automatic when you need them most. Start with just 2-3 minutes a day, and gradually increase as it becomes more natural.`
        }
      ],
      continueReadingLinks: [
        { name: "Project Gutenberg", url: "https://www.gutenberg.org/browse/scores/top" },
        { name: "Open Library", url: "https://openlibrary.org/" },
        { name: "Free Mental Health Resources", url: "https://www.mentalhealth.gov/" }
      ],
      relatedBooks: ["Mindfulness for Daily Stress", "Building Emotional Resilience", "Cognitive Strategies Handbook"]
    },
    {
      id: "mindfulness-daily-stress",
      title: "Mindfulness for Daily Stress",
      author: "Dr. Michael Chen",
      description: "Practical mindfulness techniques for managing everyday stress and pressure",
      fullDescription: "A practical guide to incorporating mindfulness into your daily routine. Learn simple yet powerful techniques that can be practiced anywhere, anytime to reduce stress and increase mental clarity.",
      keyConceptsHeading: "Key Mindfulness Concepts:",
      keyConcepts: [
        "Present-moment awareness",
        "Non-judgmental observation",
        "Mindful breathing practices",
        "Body scan meditation",
        "Mindful movement and walking",
        "Integration into daily activities"
      ],
      chapters: [
        {
          number: 1,
          title: "What Is Mindfulness?",
          content: `Mindfulness has become a buzzword in recent years, but what does it actually mean? At its essence, mindfulness is the practice of paying attention to the present moment with openness, curiosity, and acceptance.

Jon Kabat-Zinn, one of the pioneers of mindfulness in healthcare, defines it as "paying attention in a particular way: on purpose, in the present moment, and without judgment."

This might sound simple, but in our modern world of constant distractions, notifications, and multitasking, truly being present has become surprisingly difficult. Our minds are often caught up in:

- Replaying past events ("I should have said...")
- Worrying about the future ("What if...")
- Running on autopilot (eating, driving, or working without awareness)
- Getting lost in streams of thoughts and mental chatter

**The Benefits of Mindfulness:**

Research has shown that regular mindfulness practice can:
- Reduce stress and anxiety
- Improve focus and concentration
- Enhance emotional regulation
- Lower blood pressure
- Strengthen immune function
- Increase feelings of well-being and life satisfaction

**Mindfulness vs. Meditation:**

While related, mindfulness and meditation aren't the same thing:
- Meditation is a formal practice, often done sitting quietly for a set period
- Mindfulness can be practiced anytime, anywhere—while eating, walking, or even washing dishes

**Common Misconceptions:**

Mindfulness doesn't require you to:
- Empty your mind of all thoughts
- Sit in uncomfortable positions
- Spend hours in practice
- Be spiritual or religious
- Always feel calm and peaceful

Instead, mindfulness is about developing a different relationship with your thoughts and experiences—observing them without getting swept away by them.

Think of your mind like a sky and your thoughts like clouds. Clouds come and go, but the sky remains constant and spacious. Mindfulness helps you identify with the sky rather than getting lost in the clouds.`
        },
        {
          number: 2,
          title: "The Foundation: Mindful Breathing",
          content: `Your breath is the perfect anchor for mindfulness practice. It's always with you, happening in the present moment, and provides a focal point for your attention when your mind starts to wander.

**Basic Mindful Breathing Exercise:**

1. Find a comfortable position, either sitting or lying down
2. Close your eyes or soften your gaze downward
3. Begin to notice your natural breath without trying to change it
4. Focus on the physical sensations of breathing:
   - The air entering and leaving your nostrils
   - The rise and fall of your chest or belly
   - The slight pause between inhales and exhales

5. When your mind wanders (and it will!), gently return your attention to your breath
6. Continue for 5-10 minutes

**The STOP Technique:**

For busy days, try this quick mindfulness reset:
- **S**top what you're doing
- **T**ake a breath
- **O**bserve your thoughts, feelings, and surroundings
- **P**roceed with awareness

**Mindful Breathing Throughout the Day:**

You don't need to set aside special time for breathing practice. Try these informal approaches:

- Take three mindful breaths before starting your car
- Practice breathing awareness while waiting in line
- Use breathing as a transition between activities
- Set random phone alerts to remind you to breathe mindfully

**Working with Distractions:**

When practicing mindful breathing, you'll notice your mind wandering to thoughts, sounds, or physical sensations. This isn't a problem—it's completely normal! The key is to:

1. Notice when you've been distracted (this noticing IS mindfulness)
2. Gently acknowledge the distraction without judgment
3. Return your attention to your breath
4. Repeat this process as many times as needed

Each time you notice your mind has wandered and bring it back to your breath, you're strengthening your "mindfulness muscle." It's like doing bicep curls for your attention.

Remember: The goal isn't to have a perfectly quiet mind, but to develop a more aware and accepting relationship with whatever arises in your experience.`
        }
      ],
      continueReadingLinks: [
        { name: "Mindful.org Free Resources", url: "https://www.mindful.org/" },
        { name: "UCLA Mindfulness Research", url: "https://www.uclahealth.org/marc/" },
        { name: "Free Guided Meditations", url: "https://palousemindfulness.com/" }
      ],
      relatedBooks: ["Anxiety Self-Help Guide", "Building Emotional Resilience", "Cognitive Strategies Handbook"]
    },
    {
      id: "emotional-resilience",
      title: "Building Emotional Resilience",
      author: "Dr. Lisa Rodriguez",
      description: "Develop the mental strength to bounce back from life's challenges",
      fullDescription: "Learn how to build emotional resilience and develop the mental tools needed to navigate life's ups and downs with greater ease and confidence. This guide provides practical strategies based on positive psychology research.",
      keyConceptsHeading: "Key Resilience Components:",
      keyConcepts: [
        "Emotional awareness and regulation",
        "Cognitive flexibility and reframing",
        "Building support networks",
        "Developing coping strategies",
        "Post-traumatic growth",
        "Self-compassion practices"
      ],
      chapters: [
        {
          number: 1,
          title: "Understanding Emotional Resilience",
          content: `Emotional resilience isn't about being tough or suppressing your feelings. It's about developing the ability to navigate life's inevitable challenges while maintaining your mental and emotional well-being.

Think of resilience like a tree in a storm. A rigid tree might break under pressure, but a flexible tree bends with the wind and springs back when the storm passes. Emotional resilience works similarly—it's about learning to adapt and recover rather than avoiding difficulties altogether.

**What Resilience Looks Like:**

Resilient people don't experience fewer problems or feel less pain. Instead, they:
- Acknowledge their emotions without being overwhelmed by them
- Maintain perspective during difficult times
- Learn from setbacks and challenges
- Maintain hope and optimism about the future
- Build and maintain supportive relationships
- Take care of their physical and mental health

**The Science of Resilience:**

Research shows that resilience isn't a fixed trait—it's a skill that can be developed. Studies of people who've overcome significant challenges reveal common characteristics and practices that anyone can learn:

1. **Cognitive Flexibility:** The ability to see situations from multiple perspectives
2. **Emotional Regulation:** Skills for managing intense emotions
3. **Social Connection:** Strong relationships that provide support
4. **Meaning-Making:** The ability to find purpose in difficult experiences
5. **Self-Efficacy:** Confidence in your ability to handle challenges

**The Resilience Paradox:**

Here's something counterintuitive: trying to avoid all discomfort actually makes us less resilient. Like muscles that grow stronger through resistance training, our emotional resilience develops by learning to work through challenges, not by avoiding them.

This doesn't mean seeking out unnecessary stress, but rather changing our relationship with the difficulties we inevitably face.

**Building Your Resilience Baseline:**

Every person has a different starting point for resilience, influenced by:
- Early life experiences
- Genetic factors
- Cultural background
- Previous challenges overcome
- Available support systems

Regardless of your starting point, you can strengthen your resilience through intentional practice and the right strategies.`
        },
        {
          number: 2,
          title: "The Foundation of Self-Awareness",
          content: `The first step in building emotional resilience is developing self-awareness—the ability to recognize and understand your own thoughts, emotions, and behavioral patterns.

**The Emotion-Thought-Behavior Triangle:**

Understanding how your emotions, thoughts, and behaviors influence each other is crucial for resilience:

- **Emotions** influence your thoughts and behaviors
- **Thoughts** shape your emotions and actions
- **Behaviors** affect your thoughts and feelings

When you can recognize these connections, you gain more control over your responses to challenging situations.

**Developing Emotional Awareness:**

Try this simple practice throughout your day:
1. Set a gentle reminder every few hours
2. When it goes off, pause and ask yourself: "What am I feeling right now?"
3. Name the emotion as specifically as possible (frustrated vs. angry, worried vs. terrified)
4. Notice where you feel it in your body
5. Observe the emotion without trying to change it

**The RAIN Technique:**

When facing difficult emotions, use this four-step process:

- **R**ecognize: What am I experiencing right now?
- **A**llow: Can I let this feeling be here?
- **I**nvestigate: How does this feel in my body? What do I need?
- **N**urture: How can I be kind to myself in this moment?

**Common Emotional Patterns:**

Notice if you tend toward any of these patterns:
- **Catastrophizing:** Imagining the worst-case scenario
- **All-or-Nothing Thinking:** Seeing situations in black and white
- **Emotional Reasoning:** Believing that feelings equal facts
- **Mind Reading:** Assuming you know what others are thinking
- **Personalizing:** Taking responsibility for things outside your control

**Building Emotional Vocabulary:**

The more precisely you can identify your emotions, the better you can work with them. Instead of just "good" or "bad," try words like:

Positive: Content, energized, grateful, proud, hopeful, peaceful
Negative: Disappointed, overwhelmed, frustrated, anxious, lonely, irritated

**The Power of Pause:**

Between any stimulus and your response, there's a space. In that space lies your power to choose your response. The more self-aware you become, the more you can access this space and make conscious choices rather than reacting automatically.

Remember: Self-awareness isn't about judging your thoughts and feelings, but about observing them with curiosity and compassion.`
        }
      ],
      continueReadingLinks: [
        { name: "American Psychological Association", url: "https://www.apa.org/topics/resilience" },
        { name: "Resilience Research Centre", url: "https://resilienceresearch.org/" },
        { name: "Centre for Resilience", url: "https://www.centreforresilience.com/" }
      ],
      relatedBooks: ["Anxiety Self-Help Guide", "Mindfulness for Daily Stress", "Cognitive Strategies Handbook"]
    },
    {
      id: "cognitive-strategies",
      title: "Cognitive Strategies Handbook",
      author: "Dr. James Wilson",
      description: "Evidence-based thinking techniques for better mental health",
      fullDescription: "A practical handbook of cognitive strategies based on CBT principles. Learn to identify and change unhelpful thinking patterns that contribute to anxiety, depression, and stress.",
      keyConceptsHeading: "Key Cognitive Tools:",
      keyConcepts: [
        "Identifying cognitive distortions",
        "Thought challenging techniques",
        "Behavioral experiments",
        "Problem-solving strategies",
        "Goal setting and achievement",
        "Relapse prevention methods"
      ],
      chapters: [
        {
          number: 1,
          title: "The Power of Your Thoughts",
          content: `Your thoughts have incredible power over how you feel and behave. This isn't just wishful thinking—it's a fundamental principle backed by decades of psychological research and the foundation of Cognitive Behavioral Therapy (CBT), one of the most effective treatments for anxiety and depression.

**The Cognitive Model:**

The basic premise is simple: It's not situations themselves that determine how we feel, but rather how we interpret and think about those situations.

Consider this example:
- **Situation:** Your friend doesn't respond to your text message
- **Thought A:** "They must be busy with something important"
- **Feeling A:** Understanding, slight concern
- **Thought B:** "They're ignoring me because they don't like me anymore"
- **Feeling B:** Hurt, rejection, anxiety

Same situation, different thoughts, completely different emotional experiences.

**Automatic Thoughts:**

Most of our thinking happens automatically, below the level of conscious awareness. These automatic thoughts pop up instantly in response to situations and significantly influence our emotions.

Common characteristics of automatic thoughts:
- They seem believable and true
- They appear quickly and spontaneously
- They're often brief and fragmented
- We're frequently unaware of them
- They can trigger strong emotions

**The Thought-Feeling Connection:**

Understanding this connection gives you tremendous power. While you can't always control what happens to you, you can learn to:
- Become aware of your automatic thoughts
- Question whether these thoughts are accurate or helpful
- Develop more balanced, realistic ways of thinking
- Choose responses rather than react automatically

**Types of Unhelpful Thinking:**

We all engage in distorted thinking sometimes. Common patterns include:
- **All-or-Nothing:** "I made one mistake, so I'm a complete failure"
- **Mental Filter:** Focusing only on negatives while ignoring positives
- **Fortune Telling:** Predicting negative outcomes without evidence
- **Mind Reading:** Assuming you know what others are thinking
- **Catastrophizing:** Imagining the worst possible outcome

**The Good News:**

Thoughts are not facts. Just because you think something doesn't make it true. With practice, you can learn to step back from your thoughts, evaluate them objectively, and choose more helpful ways of thinking.

This isn't about positive thinking or denial—it's about thinking more accurately and realistically.`
        },
        {
          number: 2,
          title: "Catching and Examining Your Thoughts",
          content: `The first step in changing unhelpful thinking patterns is learning to catch your automatic thoughts in action. This takes practice because these thoughts happen so quickly and feel so natural that we often don't notice them.

**The Thought Record Technique:**

This is one of the most powerful tools in cognitive therapy. Here's how to use it:

**Step 1: Notice the Emotion**
When you experience a strong or unpleasant emotion, pause and ask: "What am I feeling right now?" Rate the intensity from 1-10.

**Step 2: Identify the Situation**
What was happening when you started feeling this way? Be specific about the facts, not your interpretation.

**Step 3: Catch the Thought**
Ask yourself: "What was going through my mind when I started feeling this way?" Write down the exact thoughts, even if they seem irrational.

**Step 4: Examine the Evidence**
- What evidence supports this thought?
- What evidence contradicts it?
- What would you tell a friend in this situation?
- Are you falling into any thinking traps?

**Step 5: Develop a Balanced Thought**
Create a more realistic, balanced way of thinking about the situation. This isn't about being artificially positive, but about being fair and accurate.

**Example Thought Record:**

Situation: Gave a presentation at work
Emotion: Embarrassed, anxious (8/10)
Automatic Thought: "Everyone could tell I was nervous. They probably think I'm incompetent."

Evidence For: I did stumble over a few words
Evidence Against: People nodded and asked good questions. My boss said "nice work" afterward. I've given successful presentations before.

Balanced Thought: "I was a bit nervous, which is normal. Despite stumbling a few times, I conveyed the important information clearly and people seemed engaged."

**Helpful Questions for Examining Thoughts:**

- Is this thought helpful or harmful?
- What would I tell my best friend in this situation?
- Am I falling into a thinking trap?
- What's the worst that could realistically happen?
- How will this matter in five years?
- What would someone who cares about me say?

**Common Thinking Traps to Watch For:**

- **Should statements:** "I should be perfect at everything"
- **Labeling:** "I'm a loser" instead of "I made a mistake"
- **Emotional reasoning:** "I feel anxious, so something bad will happen"
- **Magnification:** Making small problems seem huge
- **Minimization:** Discounting positive experiences or qualities

**Practice Makes Progress:**

Start by doing thought records when you notice strong emotions. With practice, you'll get better at catching thoughts in real-time and naturally thinking in more balanced ways.

Remember: The goal isn't to think positively all the time, but to think more accurately and helpfully.`
        }
      ],
      continueReadingLinks: [
        { name: "Centre for Clinical Interventions", url: "https://www.cci.health.wa.gov.au/" },
        { name: "Beck Institute for CBT", url: "https://beckinstitute.org/" },
        { name: "NHS Self-Help Resources", url: "https://www.nhs.uk/mental-health/self-help/" }
      ],
      relatedBooks: ["Anxiety Self-Help Guide", "Mindfulness for Daily Stress", "Building Emotional Resilience"]
    }
  ];

  const helplines = [
    {
      country: "Nigeria",
      lines: [
        { name: "Mental Health Nigeria", number: "+234 809 210 6493", available: "24/7" },
        { name: "Suicide Research & Prevention Initiative", number: "+234 806 210 6493", available: "24/7" }
      ]
    },
    {
      country: "United Kingdom",
      lines: [
        { name: "Samaritans", number: "116 123", available: "24/7" },
        { name: "Mind Info Line", number: "0300 123 3393", available: "9am-6pm Mon-Fri" },
        { name: "NHS 111", number: "111", available: "24/7" }
      ]
    },
    {
      country: "United States",
      lines: [
        { name: "988 Suicide & Crisis Lifeline", number: "988", available: "24/7" },
        { name: "Crisis Text Line", number: "Text HOME to 741741", available: "24/7" },
        { name: "NAMI Helpline", number: "1-800-950-6264", available: "10am-10pm ET Mon-Fri" }
      ]
    }
  ];

  const websites = [
    {
      name: "Mind",
      url: "https://www.mind.org.uk",
      description: "UK's leading mental health charity with resources, support, and information"
    },
    {
      name: "National Institute of Mental Health (NIMH)",
      url: "https://www.nimh.nih.gov",
      description: "Evidence-based research and resources on mental health conditions"
    },
    {
      name: "Headspace",
      url: "https://www.headspace.com",
      description: "Meditation and mindfulness app with free resources for mental wellness"
    }
  ];

  return (
    <div className="absolute inset-0 bg-background overflow-auto">
      {/* Header */}
      <header className="bg-slate-100 dark:bg-slate-800 py-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6 fade-in-up"> Mental Health Resources 📚</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed fade-in-up">
            Carefully curated resources to support your mental health journey with evidence-based guidance
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-20 pb-8">
        {/* Books Section */}
        <section className="fade-in-up">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl pulse-gentle">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 section-header">Recommended Books</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {books.map((book, index) => (
              <div 
                key={index} 
                className="resource-card cursor-pointer group" 
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-3 leading-tight group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">{book.title}</h3>
                  <p className="text-primary font-semibold mb-4 text-lg">by {book.author}</p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">{book.description}</p>
                  <div className="text-primary font-semibold text-lg flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                    View Details 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Book Detail Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{selectedBook.title}</h2>
                    <p className="text-xl text-primary font-semibold">by {selectedBook.author}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Tabs for different sections */}
                <div className="border-b border-border mb-6">
                  <nav className="flex space-x-8">
                    <button className="py-2 px-1 border-b-2 border-primary text-primary font-medium">
                      Read Chapters
                    </button>
                  </nav>
                </div>

                {/* Book Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    About This Book
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{selectedBook.fullDescription}</p>
                </div>

                {/* Key Concepts */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    {selectedBook.keyConceptsHeading}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedBook.keyConcepts.map((concept: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chapter Reading Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Read the First 2 Chapters
                  </h3>
                  
                  <div className="space-y-10">
                    {selectedBook.chapters.map((chapter: any, idx: number) => (
                      <div key={idx} className="group">
                        {/* Chapter Header */}
                        <div className="sticky top-4 z-10 mb-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{chapter.number}</span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {chapter.title}
                            </h4>
                          </div>
                        </div>
                        
                        {/* Chapter Content */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 group-hover:shadow-md transition-shadow duration-300">
                          <div className="prose prose-lg max-w-none">
                            {chapter.content.split('\n\n').map((paragraph: string, pIdx: number) => {
                              // Check if paragraph contains bold formatting
                              const isBold = paragraph.startsWith('**') && paragraph.endsWith('**');
                              const isSubheading = paragraph.startsWith('**') && paragraph.includes(':**');
                              
                              if (isSubheading) {
                                return (
                                  <h5 key={pIdx} className="text-lg font-semibold text-purple-700 dark:text-purple-300 mt-6 mb-3 border-l-4 border-purple-300 pl-4">
                                    {paragraph.replace(/\*\*/g, '')}
                                  </h5>
                                );
                              } else if (isBold) {
                                return (
                                  <p key={pIdx} className="font-semibold text-gray-800 dark:text-gray-200 mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-300">
                                    {paragraph.replace(/\*\*/g, '')}
                                  </p>
                                );
                              } else if (paragraph.startsWith('-')) {
                                // Handle bullet points
                                return (
                                  <ul key={pIdx} className="my-4 space-y-2">
                                    {paragraph.split('\n').map((line, lineIdx) => (
                                      <li key={lineIdx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>{line.replace(/^- /, '')}</span>
                                      </li>
                                    ))}
                                  </ul>
                                );
                              } else {
                                return (
                                  <p key={pIdx} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                    {paragraph}
                                  </p>
                                );
                              }
                            })}
                          </div>
                          
                          {/* Chapter Progress */}
                          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Chapter {chapter.number} of 2</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                                    style={{width: `${((idx + 1) / selectedBook.chapters.length) * 100}%`}}
                                  ></div>
                                </div>
                                <span>{Math.round(((idx + 1) / selectedBook.chapters.length) * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Reading CTA */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <h4 className="text-xl font-semibold text-foreground mb-3">Want to Continue Reading?</h4>
                    <p className="text-muted-foreground mb-4">
                      Enjoyed the first two chapters? Continue reading the complete book through these trusted sources:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedBook.continueReadingLinks.map((link: any, idx: number) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-primary" />
                          <span className="font-medium">{link.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Library Finder */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Find More Resources
                  </h3>
                  <a
                    href={`https://www.worldcat.org/search?q=${encodeURIComponent(selectedBook.title + ' ' + selectedBook.author)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Search for Similar Resources
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Personal Notes */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <NotebookPen className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-600 dark:text-orange-400">Your Reading Notes</span>
                  </h3>
                  <textarea
                    value={bookNotes[selectedBook.id] || ''}
                    onChange={(e) => setBookNotes(prev => ({...prev, [selectedBook.id]: e.target.value}))}
                    placeholder="Write your thoughts about what you've read so far..."
                    className="w-full h-32 p-3 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Helplines Section */}
        <section className="fade-in-up">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl pulse-gentle">
              <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 section-header">Helplines & Support Contacts</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {helplines.map((country, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 group" style={{animationDelay: `${index * 0.15}s`}}>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{country.country}</h3>
                  </div>
                  <div className="space-y-6">
                    {country.lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-300">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{line.name}</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <Phone className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <p className="text-red-700 dark:text-red-300 font-mono text-xl font-bold">{line.number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{line.available}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Websites Section */}
        <section className="fade-in-up">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl pulse-gentle">
              <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-green-600 dark:text-green-400 section-header">Helpful Websites & Blogs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {websites.map((website, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-green-200 dark:border-green-800 hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 group cursor-pointer" style={{animationDelay: `${index * 0.1}s`}}>
                <a 
                  href={website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative z-10 h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {website.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">{website.description}</p>
                  <div className="text-green-600 dark:text-green-400 font-semibold text-lg flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                    Visit website 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resources;
