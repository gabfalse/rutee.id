const Questions = [
  {
    question: "How do you handle a big project or important task at work?",
    options: [
      {
        text: "Create a big vision, divide roles, and lead the team.",
        type: "SOLARIETH",
      },
      {
        text: "Analyze details and data before taking action.",
        type: "VARNETH",
      },
      {
        text: "Look for creative ideas and out-of-the-box solutions.",
        type: "AERYTH",
      },
      {
        text: "Invite team discussions and focus on collaboration.",
        type: "NIVARETH",
      },
      {
        text: "Make quick decisions and execute immediately.",
        type: "LUNARETH",
      },
      {
        text: "Follow procedures and work steadily until done.",
        type: "THARITH",
      },
      { text: "Be flexible and adapt to changes.", type: "ELARITH" },
      {
        text: "Ensure everything is according to rules and transparent.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question:
      "When you have to make a tough decision, what do you usually consider?",
    options: [
      {
        text: "Its impact on the bigger vision and leadership.",
        type: "SOLARIETH",
      },
      { text: "Logic, data, and available facts.", type: "VARNETH" },
      {
        text: "The possibility of new ideas or creative opportunities.",
        type: "AERYTH",
      },
      { text: "The opinions and feelings of others.", type: "NIVARETH" },
      { text: "Efficiency and speed of completion.", type: "LUNARETH" },
      { text: "Safety, stability, and procedure.", type: "THARITH" },
      {
        text: "Whether it becomes an exciting challenge for me.",
        type: "ELARITH",
      },
      { text: "The right moral and ethical values.", type: "ZERYTH" },
    ],
  },
  {
    question: "How do you prioritize between multiple tasks at the same time?",
    options: [
      {
        text: "Create a long-term strategy and delegate.",
        type: "SOLARIETH",
      },
      {
        text: "Analyze details and arrange in logical order.",
        type: "VARNETH",
      },
      {
        text: "Choose the most interesting or creative first.",
        type: "AERYTH",
      },
      {
        text: "Discuss with others to find agreement.",
        type: "NIVARETH",
      },
      {
        text: "Focus on quick results and execute immediately.",
        type: "LUNARETH",
      },
      { text: "Work step by step according to procedure.", type: "THARITH" },
      { text: "Adjust to changing situations.", type: "ELARITH" },
      { text: "Choose what is most morally right.", type: "ZERYTH" },
    ],
  },
  {
    question: "What type of work environment makes you most productive?",
    options: [
      {
        text: "A competitive and challenging environment.",
        type: "SOLARIETH",
      },
      { text: "An orderly, calm place full of data.", type: "VARNETH" },
      { text: "A creative space with freedom of ideas.", type: "AERYTH" },
      {
        text: "A collaborative environment with supportive team.",
        type: "NIVARETH",
      },
      {
        text: "A place that gives freedom to make decisions.",
        type: "LUNARETH",
      },
      { text: "A stable, neat, and structured environment.", type: "THARITH" },
      { text: "A dynamic situation full of new challenges.", type: "ELARITH" },
      {
        text: "A place that upholds integrity and honesty.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question: "How do you plan and go through your daily routines?",
    options: [
      {
        text: "With ambitious targets and measured strategy.",
        type: "SOLARIETH",
      },
      {
        text: "With detailed checklists and priority analysis.",
        type: "VARNETH",
      },
      {
        text: "With spontaneity, so there’s something new every day.",
        type: "AERYTH",
      },
      {
        text: "With flexibility, adjusting to people’s needs around me.",
        type: "NIVARETH",
      },
      {
        text: "By quickly moving straight to important things.",
        type: "LUNARETH",
      },
      { text: "With a regular and disciplined schedule.", type: "THARITH" },
      { text: "With free flow, ready to adapt anytime.", type: "ELARITH" },
      { text: "With moral rules as my guide.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "What do you usually do when facing sudden disturbances or changes?",
    options: [
      { text: "Keep leading and guiding others.", type: "SOLARIETH" },
      { text: "Carefully analyze the new situation.", type: "VARNETH" },
      { text: "Find creative ways to keep going.", type: "AERYTH" },
      { text: "Seek input from people around me.", type: "NIVARETH" },
      { text: "Immediately make a quick decision.", type: "LUNARETH" },
      {
        text: "Stick to the original plan as much as possible.",
        type: "THARITH",
      },
      { text: "Adapt flexibly.", type: "ELARITH" },
      { text: "Ensure the solution doesn’t break principles.", type: "ZERYTH" },
    ],
  },
  {
    question: "How do you maintain consistency in completing daily tasks?",
    options: [
      {
        text: "With leadership motivation and a big vision.",
        type: "SOLARIETH",
      },
      {
        text: "With disciplined analysis and technical detail.",
        type: "VARNETH",
      },
      { text: "By trying new methods to avoid boredom.", type: "AERYTH" },
      { text: "With support and teamwork from others.", type: "NIVARETH" },
      { text: "With strong personal determination.", type: "LUNARETH" },
      {
        text: "With a stable and structured routine.",
        type: "THARITH",
      },
      { text: "With new challenges as a trigger.", type: "ELARITH" },
      { text: "With commitment to values and integrity.", type: "ZERYTH" },
    ],
  },
  {
    question: "What do you usually do to improve your effectiveness?",
    options: [
      { text: "Learn leadership and new strategies.", type: "SOLARIETH" },
      { text: "Sharpen technical and analytical skills.", type: "VARNETH" },
      { text: "Experiment with fresh ideas.", type: "AERYTH" },
      { text: "Learn communication and empathy.", type: "NIVARETH" },
      { text: "Practice making quick decisions.", type: "LUNARETH" },
      { text: "Improve routine discipline.", type: "THARITH" },
      { text: "Seek bigger challenges.", type: "ELARITH" },
      { text: "Strengthen personal ethics.", type: "ZERYTH" },
    ],
  },
  {
    question: "How do you usually interact with new people or a new team?",
    options: [
      {
        text: "Appear confident and become the center of attention.",
        type: "SOLARIETH",
      },
      {
        text: "Observe first, then speak based on data/facts.",
        type: "VARNETH",
      },
      { text: "Greet warmly and share creative ideas.", type: "AERYTH" },
      { text: "Try to be friendly and listen to them.", type: "NIVARETH" },
      {
        text: "Straight to the point, directly propose teamwork.",
        type: "LUNARETH",
      },
      { text: "Formal and by the rules.", type: "THARITH" },
      { text: "Relaxed and easily adaptable.", type: "ELARITH" },
      { text: "Firm, transparent, and honest.", type: "ZERYTH" },
    ],
  },
  {
    question: "What do you usually do when there’s conflict at work?",
    options: [
      { text: "Take charge and direct to finish quickly.", type: "SOLARIETH" },
      {
        text: "Use logic and analysis to find a solution.",
        type: "VARNETH",
      },
      { text: "Offer creative ideas as a middle ground.", type: "AERYTH" },
      { text: "Be a mediator and listen to all sides.", type: "NIVARETH" },
      { text: "Be firm, quickly make my own decision.", type: "LUNARETH" },
      { text: "Follow existing procedures.", type: "THARITH" },
      {
        text: "Look for challenges to solve it in a new way.",
        type: "ELARITH",
      },
      {
        text: "Stick firmly to integrity, never compromise on wrong.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question: "How do you help a friend or colleague facing difficulties?",
    options: [
      {
        text: "Give direction and motivation to rise again.",
        type: "SOLARIETH",
      },
      { text: "Help with analysis or technical solutions.", type: "VARNETH" },
      {
        text: "Find creative ideas to ease the problem.",
        type: "AERYTH",
      },
      {
        text: "Listen, give empathy, and emotional support.",
        type: "NIVARETH",
      },
      {
        text: "Directly step in to help practically.",
        type: "LUNARETH",
      },
      {
        text: "Guide according to procedures and work rules.",
        type: "THARITH",
      },
      { text: "Offer new and flexible perspectives.", type: "ELARITH" },
      {
        text: "Be a support with honesty and integrity.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question: "What role do you usually take in a group or community?",
    options: [
      { text: "Leader who directs the shared vision.", type: "SOLARIETH" },
      { text: "Analyst who focuses on details.", type: "VARNETH" },
      { text: "Innovator who brings new ideas.", type: "AERYTH" },
      { text: "Mediator who maintains team harmony.", type: "NIVARETH" },
      { text: "Executor who acts quickly.", type: "LUNARETH" },
      { text: "Keeper of structure and discipline.", type: "THARITH" },
      { text: "Mover who adapts to the situation.", type: "ELARITH" },
      { text: "Enforcer of group values and ethics.", type: "ZERYTH" },
    ],
  },
  {
    question: "What drives you to achieve certain goals at work?",
    options: [
      { text: "Big ambition to lead and succeed.", type: "SOLARIETH" },
      {
        text: "Desire to solve problems logically.",
        type: "VARNETH",
      },
      { text: "Opportunities to express creativity.", type: "AERYTH" },
      { text: "Support and collaboration with others.", type: "NIVARETH" },
      {
        text: "The push of challenges to be conquered immediately.",
        type: "LUNARETH",
      },
      {
        text: "Satisfaction from order and stable success.",
        type: "THARITH",
      },
      {
        text: "Excitement facing new and flexible situations.",
        type: "ELARITH",
      },
      { text: "Commitment to moral principles and integrity.", type: "ZERYTH" },
    ],
  },
  {
    question: "How do you usually determine personal or professional goals?",
    options: [
      {
        text: "Develop a big vision and strategic targets.",
        type: "SOLARIETH",
      },
      { text: "Based on data analysis and reality.", type: "VARNETH" },
      {
        text: "By considering fresh ideas or unique opportunities.",
        type: "AERYTH",
      },
      {
        text: "Involving input from important people around me.",
        type: "NIVARETH",
      },
      {
        text: "Quickly decide what must be achieved right away.",
        type: "LUNARETH",
      },
      {
        text: "Follow proven procedures or steps.",
        type: "THARITH",
      },
      { text: "Let goals evolve with the situation.", type: "ELARITH" },
      { text: "Ensure goals align with moral values.", type: "ZERYTH" },
    ],
  },
  {
    question: "What usually motivates you to take action?",
    options: [
      {
        text: "The desire to lead and achieve accomplishments.",
        type: "SOLARIETH",
      },
      {
        text: "The satisfaction of finding logical solutions.",
        type: "VARNETH",
      },
      { text: "The excitement of trying new creative ideas.", type: "AERYTH" },
      { text: "Good relationships and support from others.", type: "NIVARETH" },
      {
        text: "The adrenaline of completing something quickly.",
        type: "LUNARETH",
      },
      { text: "Order and consistent success.", type: "THARITH" },
      { text: "Freedom to face new challenges.", type: "ELARITH" },
      {
        text: "Belief that I act according to the right principles.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question:
      "If given the chance, what new thing would you like to try or achieve?",
    options: [
      { text: "Lead a big project with wide impact.", type: "SOLARIETH" },
      {
        text: "Try research or deep analysis in a new field.",
        type: "VARNETH",
      },
      { text: "Develop creative work or innovations.", type: "AERYTH" },
      { text: "Build a solid community or team.", type: "NIVARETH" },
      {
        text: "Chase ambitious targets in a short time.",
        type: "LUNARETH",
      },
      {
        text: "Take certification or a structured professional path.",
        type: "THARITH",
      },
      { text: "Explore opportunities beyond comfort zone.", type: "ELARITH" },
      { text: "Create programs based on integrity.", type: "ZERYTH" },
    ],
  },
  {
    question: "What makes you most uncomfortable at work?",
    options: [
      { text: "Lack of challenge or clear direction.", type: "SOLARIETH" },
      { text: "Inaccuracy of data or information.", type: "VARNETH" },
      { text: "An environment that restricts creativity.", type: "AERYTH" },
      { text: "Indifference or lack of empathy.", type: "NIVARETH" },
      { text: "Work processes that are too slow.", type: "LUNARETH" },
      { text: "Uncertainty and sudden changes.", type: "THARITH" },
      { text: "Monotonous routines without variety.", type: "ELARITH" },
      { text: "Dishonesty or unethical behavior.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "How do you usually react when facing situations that don’t go as expected?",
    options: [
      { text: "Keep leading and look for new ways.", type: "SOLARIETH" },
      {
        text: "Re-analyze to understand the root problem.",
        type: "VARNETH",
      },
      { text: "Change approach with new ideas.", type: "AERYTH" },
      {
        text: "Seek support or advice from others.",
        type: "NIVARETH",
      },
      {
        text: "Act quickly to close problem gaps.",
        type: "LUNARETH",
      },
      {
        text: "Stick with the existing plan as best as possible.",
        type: "THARITH",
      },
      {
        text: "Adapt with high flexibility.",
        type: "ELARITH",
      },
      {
        text: "Stay committed to the values I believe are right.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question:
      "What do you usually avoid because you don’t want to feel like a failure?",
    options: [
      { text: "Losing control or influence.", type: "SOLARIETH" },
      { text: "Miscalculations or wrong data.", type: "VARNETH" },
      { text: "Failing to express creativity.", type: "AERYTH" },
      { text: "Conflicts that damage relationships.", type: "NIVARETH" },
      { text: "Being unable to act quickly.", type: "LUNARETH" },
      { text: "Chaos that destroys order.", type: "THARITH" },
      {
        text: "Being stuck in routine without new challenges.",
        type: "ELARITH",
      },
      { text: "Compromising principles or integrity.", type: "ZERYTH" },
    ],
  },
  {
    question: "What usually makes you stressed or frustrated at work?",
    options: [
      { text: "Lack of direction or clear leadership.", type: "SOLARIETH" },
      { text: "Inconsistent or unclear data.", type: "VARNETH" },
      { text: "An environment that suppresses creativity.", type: "AERYTH" },
      { text: "Work relationships full of conflict.", type: "NIVARETH" },
      { text: "Processes that are slow and lengthy.", type: "LUNARETH" },
      { text: "Sudden changes without clear procedures.", type: "THARITH" },
      {
        text: "Monotonous tasks without challenging variety.",
        type: "ELARITH",
      },
      { text: "Actions that go against ethics.", type: "ZERYTH" },
    ],
  },
];

export default Questions;
