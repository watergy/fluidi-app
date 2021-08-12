import {translate as t} from './Translation.js';
import $ from 'jquery';
import _ from 'lodash';
import iris from 'iris-lib';
import Autolinker from 'autolinker';

let emojiRegex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]+/ug;

function setImgSrc(el, src) {
  if (src && src.indexOf('data:image') === 0) {
    el.attr('src', src);
  }
  return el;
}

const userAgent = navigator.userAgent.toLowerCase();
const isElectron = (userAgent.indexOf(' electron/') > -1);

const animals = [
  'canidae',
  'felidae',
  'cat',
  'cattle',
  'dog',
  'donkey',
  'goat',
  'horse',
  'pig',
  'rabbit',
  'aardvark',
  'aardwolf',
  'albatross',
  'alligator',
  'alpaca',
  'amphibian',
  'anaconda',
  'angelfish',
  'anglerfish',
  'ant',
  'anteater',
  'antelope',
  'antlion',
  'ape',
  'aphid',
  'armadillo',
  'asp',
  'baboon',
  'badger',
  'bandicoot',
  'barnacle',
  'barracuda',
  'basilisk',
  'bass',
  'bat',
  'bear',
  'beaver',
  'bedbug',
  'bee',
  'beetle',
  'bird',
  'bison',
  'blackbird',
  'boa',
  'boar',
  'bobcat',
  'bobolink',
  'bonobo',
  'booby',
  'bovid',
  'bug',
  'butterfly',
  'buzzard',
  'camel',
  'canid',
  'capybara',
  'cardinal',
  'caribou',
  'carp',
  'cat',
  'catshark',
  'caterpillar',
  'catfish',
  'cattle',
  'centipede',
  'cephalopod',
  'chameleon',
  'cheetah',
  'chickadee',
  'chicken',
  'chimpanzee',
  'chinchilla',
  'chipmunk',
  'clam',
  'clownfish',
  'cobra',
  'cockroach',
  'cod',
  'condor',
  'constrictor',
  'coral',
  'cougar',
  'cow',
  'coyote',
  'crab',
  'crane',
  'crawdad',
  'crayfish',
  'cricket',
  'crocodile',
  'crow',
  'cuckoo',
  'cicada',
  'damselfly',
  'deer',
  'dingo',
  'dinosaur',
  'dog',
  'dolphin',
  'donkey',
  'dormouse',
  'dove',
  'dragonfly',
  'dragon',
  'duck',
  'eagle',
  'earthworm',
  'earwig',
  'echidna',
  'eel',
  'egret',
  'elephant',
  'elk',
  'emu',
  'ermine',
  'falcon',
  'ferret',
  'finch',
  'firefly',
  'fish',
  'flamingo',
  'flea',
  'fly',
  'flyingfish',
  'fowl',
  'fox',
  'frog',
  'gamefowl',
  'galliform',
  'gazelle',
  'gecko',
  'gerbil',
  'gibbon',
  'giraffe',
  'goat',
  'goldfish',
  'goose',
  'gopher',
  'gorilla',
  'grasshopper',
  'grouse',
  'guan',
  'guanaco',
  'guineafowl',
  'gull',
  'guppy',
  'haddock',
  'halibut',
  'hamster',
  'hare',
  'harrier',
  'hawk',
  'hedgehog',
  'heron',
  'herring',
  'hippopotamus',
  'hookworm',
  'hornet',
  'horse',
  'hoverfly',
  'hummingbird',
  'hyena',
  'iguana',
  'impala',
  'jackal',
  'jaguar',
  'jay',
  'jellyfish',
  'junglefowl',
  'kangaroo',
  'kingfisher',
  'kite',
  'kiwi',
  'koala',
  'koi',
  'krill',
  'ladybug',
  'lamprey',
  'landfowl',
  'lark',
  'leech',
  'lemming',
  'lemur',
  'leopard',
  'leopon',
  'limpet',
  'lion',
  'lizard',
  'llama',
  'lobster',
  'locust',
  'loon',
  'louse',
  'lungfish',
  'lynx',
  'macaw',
  'mackerel',
  'magpie',
  'mammal',
  'manatee',
  'mandrill',
  'marlin',
  'marmoset',
  'marmot',
  'marsupial',
  'marten',
  'mastodon',
  'meadowlark',
  'meerkat',
  'mink',
  'minnow',
  'mite',
  'mockingbird',
  'mole',
  'mollusk',
  'mongoose',
  'monkey',
  'moose',
  'mosquito',
  'moth',
  'mouse',
  'mule',
  'muskox',
  'narwhal',
  'newt',
  'nightingale',
  'ocelot',
  'octopus',
  'opossum',
  'orangutan',
  'orca',
  'ostrich',
  'otter',
  'owl',
  'ox',
  'panda',
  'panther',
  'parakeet',
  'parrot',
  'parrotfish',
  'partridge',
  'peacock',
  'peafowl',
  'pelican',
  'penguin',
  'perch',
  'pheasant',
  'pig',
  'pigeon',
  'pike',
  'pinniped',
  'piranha',
  'planarian',
  'platypus',
  'pony',
  'porcupine',
  'porpoise',
  'possum',
  'prawn',
  'primate',
  'ptarmigan',
  'puffin',
  'puma',
  'python',
  'quail',
  'quelea',
  'quokka',
  'rabbit',
  'raccoon',
  'rat',
  'rattlesnake',
  'raven',
  'reindeer',
  'reptile',
  'rhinoceros',
  'roadrunner',
  'rodent',
  'rook',
  'rooster',
  'roundworm',
  'sailfish',
  'salamander',
  'salmon',
  'sawfish',
  'scallop',
  'scorpion',
  'seahorse',
  'shark',
  'sheep',
  'shrew',
  'shrimp',
  'silkworm',
  'silverfish',
  'skink',
  'skunk',
  'sloth',
  'slug',
  'smelt',
  'snail',
  'snake',
  'snipe',
  'sole',
  'sparrow',
  'spider',
  'spoonbill',
  'squid',
  'squirrel',
  'starfish',
  'stingray',
  'stoat',
  'stork',
  'sturgeon',
  'swallow',
  'swan',
  'swift',
  'swordfish',
  'swordtail',
  'tahr',
  'takin',
  'tapir',
  'tarantula',
  'tarsier',
  'termite',
  'tern',
  'thrush',
  'tick',
  'tiger',
  'tiglon',
  'toad',
  'tortoise',
  'toucan',
  'trout',
  'tuna',
  'turkey',
  'turtle',
  'tyrannosaurus',
  'urial',
  'vicuna',
  'viper',
  'vole',
  'vulture',
  'wallaby',
  'walrus',
  'wasp',
  'warbler',
  'weasel',
  'whale',
  'whippet',
  'whitefish',
  'wildcat',
  'wildebeest',
  'wildfowl',
  'wolf',
  'wolverine',
  'wombat',
  'woodpecker',
  'worm',
  'wren',
  'xerinae',
  'yak',
  'zebra',
  'alpaca',
  'cat',
  'cattle',
  'chicken',
  'dog',
  'donkey',
  'ferret',
  'gayal',
  'goldfish',
  'guppy',
  'horse',
  'koi',
  'llama',
  'sheep',
  'yak',
  'unicorn',
];

const adjectives = [
  'average',
  'big',
  'colossal',
  'fat',
  'giant',
  'gigantic',
  'great',
  'huge',
  'immense',
  'large',
  'little',
  'long',
  'mammoth',
  'massive',
  'miniature',
  'petite',
  'puny',
  'short',
  'small',
  'tall',
  'tiny',
  'boiling',
  'breezy',
  'broken',
  'bumpy',
  'chilly',
  'cold',
  'cool',
  'creepy',
  'crooked',
  'cuddly',
  'curly',
  'damaged',
  'damp',
  'dirty',
  'dry',
  'dusty',
  'filthy',
  'flaky',
  'fluffy',
  'wet',
  'broad',
  'chubby',
  'crooked',
  'curved',
  'deep',
  'flat',
  'high',
  'hollow',
  'low',
  'narrow',
  'round',
  'shallow',
  'skinny',
  'square',
  'steep',
  'straight',
  'wide',
  'ancient',
  'brief',
  'early',
  'fast',
  'late',
  'long',
  'modern',
  'old',
  'quick',
  'rapid',
  'short',
  'slow',
  'swift',
  'young',
  'abundant',
  'empty',
  'few',
  'heavy',
  'light',
  'many',
  'numerous',
  'Sound',
  'cooing',
  'deafening',
  'faint',
  'harsh',
  'hissing',
  'hushed',
  'husky',
  'loud',
  'melodic',
  'moaning',
  'mute',
  'noisy',
  'purring',
  'quiet',
  'raspy',
  'resonant',
  'screeching',
  'shrill',
  'silent',
  'soft',
  'squealing',
  'thundering',
  'voiceless',
  'whispering',
  'bitter',
  'delicious',
  'fresh',
  'juicy',
  'ripe',
  'rotten',
  'salty',
  'sour',
  'spicy',
  'stale',
  'sticky',
  'strong',
  'sweet',
  'tasteless',
  'tasty',
  'thirsty',
  'fluttering',
  'fuzzy',
  'greasy',
  'grubby',
  'hard',
  'hot',
  'icy',
  'loose',
  'melted',
  'plastic',
  'prickly',
  'rainy',
  'rough',
  'scattered',
  'shaggy',
  'shaky',
  'sharp',
  'shivering',
  'silky',
  'slimy',
  'slippery',
  'smooth',
  'soft',
  'solid',
  'steady',
  'sticky',
  'tender',
  'tight',
  'uneven',
  'weak',
  'wet',
  'wooden',
  'afraid',
  'angry',
  'annoyed',
  'anxious',
  'arrogant',
  'ashamed',
  'awful',
  'bad',
  'bewildered',
  'bored',
  'combative',
  'condemned',
  'confused',
  'creepy',
  'cruel',
  'dangerous',
  'defeated',
  'defiant',
  'depressed',
  'disgusted',
  'disturbed',
  'eerie',
  'embarrassed',
  'envious',
  'evil',
  'fierce',
  'foolish',
  'frantic',
  'frightened',
  'grieving',
  'helpless',
  'homeless',
  'hungry',
  'hurt',
  'ill',
  'jealous',
  'lonely',
  'mysterious',
  'naughty',
  'nervous',
  'obnoxious',
  'outrageous',
  'panicky',
  'repulsive',
  'scary',
  'scornful',
  'selfish',
  'sore',
  'tense',
  'terrible',
  'thoughtless',
  'tired',
  'troubled',
  'upset',
  'uptight',
  'weary',
  'wicked',
  'worried',
  'agreeable',
  'amused',
  'brave',
  'calm',
  'charming',
  'cheerful',
  'comfortable',
  'cooperative',
  'courageous',
  'delightful',
  'determined',
  'eager',
  'elated',
  'enchanting',
  'encouraging',
  'energetic',
  'enthusiastic',
  'excited',
  'exuberant',
  'fair',
  'faithful',
  'fantastic',
  'fine',
  'friendly',
  'funny',
  'gentle',
  'glorious',
  'good',
  'happy',
  'healthy',
  'helpful',
  'hilarious',
  'jolly',
  'joyous',
  'kind',
  'lively',
  'lovely',
  'lucky',
  'obedient',
  'perfect',
  'pleasant',
  'proud',
  'relieved',
  'silly',
  'smiling',
  'splendid',
  'successful',
  'thoughtful',
  'victorious',
  'vivacious',
  'witty',
  'wonderful',
  'zealous',
  'zany',
  'other',
  'good',
  'new',
  'old',
  'great',
  'high',
  'small',
  'different',
  'large',
  'local',
  'social',
  'important',
  'long',
  'young',
  'national',
  'british',
  'right',
  'early',
  'possible',
  'big',
  'little',
  'political',
  'able',
  'late',
  'general',
  'full',
  'far',
  'low',
  'public',
  'available',
  'bad',
  'main',
  'sure',
  'clear',
  'major',
  'economic',
  'only',
  'likely',
  'real',
  'black',
  'particular',
  'international',
  'special',
  'difficult',
  'certain',
  'open',
  'whole',
  'white',
  'free',
  'short',
  'easy',
  'strong',
  'european',
  'central',
  'similar',
  'human',
  'common',
  'necessary',
  'single',
  'personal',
  'hard',
  'private',
  'poor',
  'financial',
  'wide',
  'foreign',
  'simple',
  'recent',
  'concerned',
  'american',
  'various',
  'close',
  'fine',
  'english',
  'wrong',
  'present',
  'royal',
  'natural',
  'individual',
  'nice',
  'french',
  'nihilist',
  'solipsist',
  'materialist',
  'surrealist',
  'heroic',
  'awesome',
  'hedonist',
  'absurd',
  'current',
  'modern',
  'labour',
  'legal',
  'happy',
  'final',
  'red',
  'normal',
  'serious',
  'previous',
  'total',
  'prime',
  'significant',
  'industrial',
  'sorry',
  'dead',
  'specific',
  'appropriate',
  'top',
  'soviet',
  'basic',
  'military',
  'original',
  'successful',
  'aware',
  'hon',
  'popular',
  'heavy',
  'professional',
  'direct',
  'dark',
  'cold',
  'ready',
  'green',
  'useful',
  'effective',
  'western',
  'traditional',
  'scottish',
  'german',
  'independent',
  'deep',
  'interesting',
  'considerable',
  'involved',
  'physical',
  'hot',
  'existing',
  'responsible',
  'complete',
  'medical',
  'blue',
  'extra',
  'past',
  'male',
  'interested',
  'fair',
  'essential',
  'beautiful',
  'civil',
  'primary',
  'obvious',
  'future',
  'environmental',
  'positive',
  'senior',
  'nuclear',
  'annual',
  'relevant',
  'huge',
  'rich',
  'commercial',
  'safe',
  'regional',
  'practical',
  'official',
  'separate',
  'key',
  'chief',
  'regular',
  'due',
  'additional',
  'active',
  'powerful',
  'complex',
  'standard',
  'impossible',
  'light',
  'warm',
  'middle',
  'fresh',
  'sexual',
  'front',
  'domestic',
  'actual',
  'united',
  'technical',
  'ordinary',
  'cheap',
  'strange',
  'internal',
  'excellent',
  'quiet',
  'soft',
  'potential',
  'northern',
  'religious',
  'quick',
  'very',
  'famous',
  'cultural',
  'proper',
  'broad',
  'joint',
  'formal',
  'limited',
  'conservative',
  'lovely',
  'usual',
  'ltd',
  'unable',
  'rural',
  'initial',
  'substantial',
  'bright',
  'average',
  'leading',
  'reasonable',
  'immediate',
  'suitable',
  'equal',
  'detailed',
  'working',
  'overall',
  'female',
  'afraid',
  'democratic',
  'growing',
  'sufficient',
  'scientific',
  'eastern',
  'correct',
  'inc',
  'irish',
  'expensive',
  'educational',
  'mental',
  'dangerous',
  'critical',
  'increased',
  'familiar',
  'unlikely',
  'double',
  'perfect',
  'slow',
  'tiny',
  'dry',
  'historical',
  'thin',
  'daily',
  'southern',
  'increasing',
  'wild',
  'alone',
  'urban',
  'empty',
  'married',
  'narrow',
  'liberal',
  'supposed',
  'upper',
  'apparent',
  'tall',
  'busy',
  'bloody',
  'prepared',
  'russian',
  'moral',
  'careful',
  'clean',
  'attractive',
  'japanese',
  'vital',
  'thick',
  'alternative',
  'fast',
  'ancient',
  'elderly',
  'rare',
  'external',
  'capable',
  'brief',
  'wonderful',
  'grand',
  'typical',
  'entire',
  'grey',
  'constant',
  'vast',
  'surprised',
  'ideal',
  'terrible',
  'academic',
  'funny',
  'minor',
  'pleased',
  'severe',
  'ill',
  'corporate',
  'negative',
  'permanent',
  'weak',
  'brown',
  'fundamental',
  'odd',
  'crucial',
  'inner',
  'used',
  'criminal',
  'contemporary',
  'sharp',
  'sick',
  'near',
  'roman',
  'massive',
  'unique',
  'secondary',
  'parliamentary',
  'african',
  'unknown',
  'subsequent',
  'angry',
  'alive',
  'guilty',
  'lucky',
  'enormous',
  'well',
  'yellow',
  'unusual',
  'net',
  'tough',
  'dear',
  'extensive',
  'glad',
  'remaining',
  'agricultural',
  'alright',
  'healthy',
  'italian',
  'principal',
  'tired',
  'efficient',
  'comfortable',
  'chinese',
  'relative',
  'friendly',
  'conventional',
  'willing',
  'sudden',
  'proposed',
  'voluntary',
  'slight',
  'valuable',
  'dramatic',
  'golden',
  'temporary',
  'federal',
  'keen',
  'flat',
  'silent',
  'indian',
  'worried',
  'pale',
  'statutory',
  'welsh',
  'dependent',
  'firm',
  'wet',
  'competitive',
  'armed',
  'radical',
  'outside',
  'acceptable',
  'sensitive',
  'living',
  'pure',
  'global',
  'emotional',
  'sad',
  'secret',
  'rapid',
  'adequate',
  'fixed',
  'sweet',
  'administrative',
  'wooden',
  'remarkable',
  'comprehensive',
  'surprising',
  'solid',
  'rough',
  'mere',
  'mass',
  'brilliant',
  'maximum',
  'absolute',
  'electronic',
  'visual',
  'electric',
  'cool',
  'spanish',
  'literary',
  'continuing',
  'supreme',
  'chemical',
  'genuine',
  'exciting',
  'written',
  'advanced',
  'extreme',
  'classical',
  'fit',
  'favourite',
  'widespread',
  'confident',
  'straight',
  'proud',
  'numerous',
  'opposite',
  'distinct',
  'mad',
  'helpful',
  'given',
  'disabled',
  'consistent',
  'anxious',
  'nervous',
  'awful',
  'stable',
  'constitutional',
  'satisfied',
  'conscious',
  'developing',
  'strategic',
  'holy',
  'smooth',
  'dominant',
  'remote',
  'theoretical',
  'outstanding',
  'pink',
  'pretty',
  'clinical',
  'minimum',
  'honest',
  'impressive',
  'related',
  'residential',
  'extraordinary',
  'plain',
  'visible',
  'accurate',
  'distant',
  'still',
  'greek',
  'complicated',
  'musical',
  'precise',
  'gentle',
  'broken',
  'live',
  'silly',
  'fat',
  'tight',
  'monetary',
  'round',
  'psychological',
  'violent',
  'unemployed',
  'inevitable',
  'junior',
  'sensible',
  'grateful',
  'pleasant',
  'dirty',
  'structural',
  'welcome',
  'deaf',
  'above',
  'continuous',
  'blind',
  'overseas',
  'mean',
  'entitled',
  'delighted',
  'loose',
  'occasional',
  'evident',
  'desperate',
  'fellow',
  'universal',
  'square',
  'steady',
  'classic',
  'equivalent',
  'intellectual',
  'victorian',
  'level',
  'ultimate',
  'creative',
  'lost',
  'medieval',
  'clever',
  'linguistic',
  'convinced',
  'judicial',
  'raw',
  'sophisticated',
  'asleep',
  'vulnerable',
  'illegal',
  'outer',
  'revolutionary',
  'bitter',
  'changing',
  'australian',
  'native',
  'imperial',
  'strict',
  'wise',
  'informal',
  'flexible',
  'collective',
  'frequent',
  'experimental',
  'spiritual',
  'intense',
  'rational',
  'generous',
  'inadequate',
  'prominent',
  'logical',
  'bare',
  'historic',
  'modest',
  'dutch',
  'acute',
  'electrical',
  'valid',
  'weekly',
  'gross',
  'automatic',
  'loud',
  'reliable',
  'mutual',
  'liable',
  'multiple',
  'ruling',
  'curious',
  'sole',
  'managing',
  'pregnant',
  'latin',
  'nearby',
  'exact',
  'underlying',
  'identical',
  'satisfactory',
  'marginal',
  'distinctive',
  'electoral',
  'urgent',
  'presidential',
  'controversial',
  'everyday',
  'encouraging',
  'organic',
  'continued',
  'expected',
  'statistical',
  'desirable',
  'innocent',
  'improved',
  'exclusive',
  'marked',
  'experienced',
  'unexpected',
  'superb',
  'sheer',
  'disappointed',
  'frightened',
  'gastric',
  'romantic',
  'naked',
  'reluctant',
  'magnificent',
  'convenient',
  'established',
  'closed',
  'uncertain',
  'artificial',
  'diplomatic',
  'tremendous',
  'marine',
  'mechanical',
  'retail',
  'institutional',
  'mixed',
  'required',
  'biological',
  'known',
  'functional',
  'straightforward',
  'superior',
  'digital',
  'spectacular',
  'unhappy',
  'confused',
  'unfair',
  'aggressive',
  'spare',
  'painful',
  'abstract',
  'asian',
  'associated',
  'legislative',
  'monthly',
  'intelligent',
  'hungry',
  'explicit',
  'nasty',
  'just',
  'faint',
  'coloured',
  'ridiculous',
  'amazing',
  'comparable',
  'successive',
  'realistic',
  'back',
  'decent',
  'decentralized',
  'bitcoin',
  'cypherpunk',
  'unnecessary',
  'flying',
  'random',
  'influential',
  'dull',
  'genetic',
  'neat',
  'marvellous',
  'crazy',
  'damp',
  'giant',
  'secure',
  'bottom',
  'skilled',
  'subtle',
  'elegant',
  'brave',
  'lesser',
  'parallel',
  'steep',
  'intensive',
  'casual',
  'tropical',
  'lonely',
  'partial',
  'preliminary',
  'concrete',
  'alleged',
  'assistant',
  'vertical',
  'upset',
  'delicate',
  'mild',
  'occupational',
  'excessive',
  'progressive',
  'exceptional',
  'integrated',
  'striking',
  'continental',
  'okay',
  'harsh',
  'combined',
  'fierce',
  'handsome',
  'characteristic',
  'chronic',
  'compulsory',
  'interim',
  'objective',
  'splendid',
  'magic',
  'systematic',
  'obliged',
  'payable',
  'fun',
  'horrible',
  'primitive',
  'fascinating',
  'ideological',
  'metropolitan',
  'surrounding',
  'estimated',
  'peaceful',
  'premier',
  'operational',
  'technological',
  'kind',
  'advisory',
  'hostile',
  'precious',
  'accessible',
  'determined',
  'excited',
  'impressed',
  'provincial',
  'smart',
  'endless',
  'isolated',
  'drunk',
  'geographical',
  'like',
  'dynamic',
  'boring',
  'forthcoming',
  'unfortunate',
  'definite',
  'super',
  'notable',
  'indirect',
  'stiff',
  'wealthy',
  'awkward',
  'lively',
  'neutral',
  'artistic',
  'content',
  'mature',
  'colonial',
  'ambitious',
  'evil',
  'magnetic',
  'verbal',
  'legitimate',
  'sympathetic',
  'empirical',
  'head',
  'shallow',
  'vague',
  'naval',
  'depressed',
  'shared',
  'added',
  'shocked',
  'mid',
  'worthwhile',
  'qualified',
  'missing',
  'blank',
  'absent',
  'favourable',
  'polish',
  'israeli',
  'developed',
  'profound',
  'representative',
  'enthusiastic',
  'dreadful',
  'rigid',
  'reduced',
  'cruel',
  'coastal',
  'peculiar',
  'swiss',
  'crude',
  'extended',
  'selected',
  'eager',
  'canadian',
  'bold',
  'relaxed',
  'corresponding',
  'running',
  'planned',
  'applicable',
  'immense',
  'allied',
  'comparative',
  'uncomfortable',
  'conservation',
  'productive',
  'beneficial',
  'bored',
  'charming',
  'minimal',
  'mobile',
  'turkish',
  'orange',
  'rear',
  'passive',
  'suspicious',
  'overwhelming',
  'fatal',
  'resulting',
  'symbolic',
  'registered',
  'neighbouring',
  'calm',
  'irrelevant',
  'patient',
  'compact',
  'profitable',
  'rival',
  'loyal',
  'moderate',
  'distinguished',
  'interior',
  'noble',
  'insufficient',
  'eligible',
  'mysterious',
  'varying',
  'managerial',
  'molecular',
  'olympic',
  'linear',
  'prospective',
  'printed',
  'parental',
  'diverse',
  'elaborate',
  'furious',
  'fiscal',
  'burning',
  'useless',
  'semantic',
  'embarrassed',
  'inherent',
  'philosophical',
  'deliberate',
  'awake',
  'variable',
  'promising',
  'unpleasant',
  'varied',
  'sacred',
  'selective',
  'inclined',
  'tender',
  'hidden',
  'worthy',
  'intermediate',
  'sound',
  'protective',
  'fortunate',
  'slim',
  'defensive',
  'divine',
  'stuck',
  'driving',
  'invisible',
  'misleading',
  'circular',
  'mathematical',
  'inappropriate',
  'liquid',
  'persistent',
  'solar',
  'doubtful',
  'manual',
  'architectural',
  'intact',
  'incredible',
  'devoted',
  'prior',
  'tragic',
  'respectable',
  'optimistic',
  'convincing',
  'unacceptable',
  'decisive',
  'competent',
  'spatial',
  'respective',
  'binding',
  'relieved',
  'nursing',
  'toxic',
  'select',
  'redundant',
  'integral',
  'then',
  'probable',
  'amateur',
  'fond',
  'passing',
  'specified',
  'territorial',
  'horizontal',
  'inland',
  'cognitive',
  'regulatory',
  'miserable',
  'resident',
  'polite',
  'scared',
  'gothic',
  'civilian',
  'instant',
  'lengthy',
  'adverse',
  'korean',
  'unconscious',
  'anonymous',
  'aesthetic',
  'orthodox',
  'static',
  'unaware',
  'costly',
  'fantastic',
  'foolish',
  'fashionable',
  'causal',
  'compatible',
  'wee',
  'implicit',
  'dual',
  'ok',
  'cheerful',
  'subjective',
  'forward',
  'surviving',
  'exotic',
  'purple',
  'cautious',
  'visiting',
  'aggregate',
  'ethical',
  'teenage',
  'dying',
  'disastrous',
  'delicious',
  'confidential',
  'underground',
  'thorough',
  'grim',
  'autonomous',
  'atomic',
  'frozen',
  'colourful',
  'injured',
  'uniform',
  'ashamed',
  'glorious',
  'wicked',
  'coherent',
  'rising',
  'shy',
  'novel',
  'balanced',
  'delightful',
  'arbitrary',
  'adjacent',
  'worrying',
  'weird',
  'unchanged',
  'rolling',
  'evolutionary',
  'intimate',
  'sporting',
  'disciplinary',
  'formidable',
  'lexical',
  'noisy',
  'gradual',
  'accused',
  'homeless',
  'supporting',
  'coming',
  'renewed',
  'excess',
  'retired',
  'rubber',
  'chosen',
  'outdoor',
  'embarrassing',
  'preferred',
  'bizarre',
  'appalling',
  'agreed',
  'imaginative',
  'governing',
  'accepted',
  'vocational',
  'mighty',
  'puzzled',
  'worldwide',
  'organisational',
  'sunny',
  'eldest',
  'eventual',
  'spontaneous',
  'vivid',
  'rude',
  'faithful',
  'ministerial',
  'innovative',
  'controlled',
  'conceptual',
  'unwilling',
  'civic',
  'meaningful',
  'alive',
  'brainy',
  'breakable',
  'busy',
  'careful',
  'cautious',
  'clever',
  'concerned',
  'crazy',
  'curious',
  'dead',
  'different',
  'difficult',
  'doubtful',
  'easy',
  'famous',
  'fragile',
  'helpful',
  'helpless',
  'important',
  'impossible',
  'innocent',
  'inquisitive',
  'modern',
  'open',
  'outstanding',
  'poor',
  'powerful',
  'puzzled',
  'real',
  'rich',
  'shy',
  'sleepy',
  'super',
  'tame',
  'uninterested',
  'wandering',
  'wild',
  'wrong',
  'adorable',
  'alert',
  'average',
  'beautiful',
  'blonde',
  'bloody',
  'blushing',
  'bright',
  'clean',
  'clear',
  'cloudy',
  'colorful',
  'crowded',
  'cute',
  'dark',
  'drab',
  'distinct',
  'dull',
  'elegant',
  'fancy',
  'filthy',
  'glamorous',
  'gleaming',
  'graceful',
  'grotesque',
  'homely',
  'light',
  'misty',
  'motionless',
  'muddy',
  'plain',
  'poised',
  'quaint',
  'shiny',
  'smoggy',
  'sparkling',
  'spotless',
  'stormy',
  'strange',
  'ugly',
  'unsightly',
  'unusual',
  'bad',
  'better',
  'beautiful',
  'big',
  'black',
  'blue',
  'bright',
  'clumsy',
  'crazy',
  'dizzy',
  'dull',
  'fat',
  'frail',
  'friendly',
  'funny',
  'great',
  'green',
  'gigantic',
  'gorgeous',
  'grumpy',
  'handsome',
  'happy',
  'horrible',
  'itchy',
  'jittery',
  'jolly',
  'kind',
  'long',
  'lazy',
  'magnificent',
  'magenta',
  'many',
  'mighty',
  'mushy',
  'nasty',
  'new',
  'nice',
  'nosy',
  'nutty',
  'nutritious',
  'odd',
  'orange',
  'ordinary',
  'pretty',
  'precious',
  'prickly',
  'purple',
  'quaint',
  'quiet',
  'quick',
  'quickest',
  'rainy',
  'rare',
  'ratty',
  'red',
  'roasted',
  'robust',
  'round',
  'sad',
  'scary',
  'scrawny',
  'short',
  'silly',
  'stingy',
  'strange',
  'striped',
  'spotty',
  'tart',
  'tall',
  'tame',
  'tan',
  'tender',
  'testy',
  'tricky',
  'tough',
  'ugly',
  'ugliest',
  'vast',
  'watery',
  'wasteful',
  'wonderful',
  'yellow',
  'yummy',
  'zany',
];

export default {
  isUrl(s) {
    let matches = Autolinker.parse(s, {urls: true});
    return matches.length === 1 && matches[0].getUrl() === s;
  },

  capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  },

  generateName() {
    return `${this.capitalize(_.sample(adjectives))  } ${  this.capitalize(_.sample(animals))}`;
  },

  isEmoji(s) {
    return s.match(emojiRegex);
  },

  highlightEmoji(s) {
    return s.replace(emojiRegex, '<span class="emoji">$&</span>');
  },

  copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
      // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
      return window.clipboardData.setData("Text", text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      let textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      }
      catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
      }
      finally {
        document.body.removeChild(textarea);
      }
    }
  },

  getUrlParameter(sParam, sParams) {
    let sPageURL = sParams || window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  },

  showConsoleWarning() {
    let i = "Stop!",
          j = "This is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or \"hack\" someone's account, it is a scam and will give them access to your account.";

    if ((window.chrome || window.safari)) {
      let l = 'font-family:helvetica; font-size:20px; ';
      [
         [i, `${l  }font-size:50px; font-weight:bold; color:red; -webkit-text-stroke:1px black;`],
         [j, l],
         ['', '']
      ].map((r) => {
          setTimeout(console.log.bind(console, `\n%c${  r[0]}`, r[1]));
      });
    }
  },

  getRelativeTimeText(date) {
    let text = date && iris.util.getDaySeparatorText(date, date.toLocaleDateString({dateStyle:'short'}));
    text = t(text);
    if (text === t('today')) { text = iris.util.formatTime(date); }
    return text;
  },

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))  } ${  sizes[i]}`;
  },

  download(filename, data, type, charset, href) {
    let hiddenElement;
    if (charset === null) {
      charset = 'utf-8';
    }
    hiddenElement = document.createElement('a');
    hiddenElement.href = href || (`data:${  type  };charset=${  charset  },${  encodeURI(data)}`);
    hiddenElement.target = '_blank';
    hiddenElement.download = filename;
    return hiddenElement.click();
  },

  truncateString(s, length = 30) {
    return s.length > length ? `${s.slice(0, length)  }...` : s;
  },

  getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(`Error: ${  error}`);
      };
    });
  },

  checkColorScheme() {
    // If `prefers-color-scheme` is not supported, fall back to light mode.
    if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
        document.documentElement.style.display = 'none';
        document.head.insertAdjacentHTML(
            'beforeend',
            '<link rel="stylesheet" href="./css/light.css" onload="document.documentElement.style.display = \'\'">'
        );
    }
  },

  scrollToMessageListBottom: _.throttle(() => {
    if ($('#message-view')[0]) {
      $('#message-view').scrollTop($('#message-view')[0].scrollHeight - $('#message-view')[0].clientHeight);
    }
  }, 100, true),

  setImgSrc,

  animateScrollTop: selector => {
    const el = $(selector);
    el.css({overflow:'hidden'});
    setTimeout(() => {
      el.css({overflow:''});
      el.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchstart", e => {
        if (e.which > 0 || e.type === "mousedown" || e.type === "mousewheel" || e.type === 'touchstart') {
          el.stop(true);
        }
      });
      el.stop().animate({ scrollTop: 0 }, {duration: 400, queue: false, always: () => {
        el.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchstart");
      }});
    }, 10);
  },

  async getWebTorrentClient() {
    const { default: WebTorrent } = await import('webtorrent');
    if (!this.wtClient) {
      this.wtClient = new WebTorrent();
    }
    return this.wtClient;
  },

  getProfileLink(pub) {
    return `https://iris.to/profile/${  encodeURIComponent(pub)}`;
  },

  isElectron
};