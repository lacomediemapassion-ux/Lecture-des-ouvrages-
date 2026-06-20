import { Book } from "../types";

export const CLASSIC_BOOKS: Book[] = [
  {
    id: "petit-prince",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    description: "Un chef-d'œuvre poétique et philosophique relatant la rencontre magique entre un aviateur égaré dans le désert du Sahara et un petit prince venu d'un autre monde.",
    coverGradient: "from-sky-950 via-slate-900 to-indigo-900 border border-amber-500/30",
    coverIcon: "Sparkles",
    category: "Conte",
    rating: 5,
    year: "1943",
    wordCount: 15300,
    chapters: [
      {
        id: "ch-1",
        title: "Chapitre I : Le serpent boa et les grandes personnes",
        content: `Lorsque j'avais six ans j'ai vu, une fois, une magnifique image, dans un livre sur la Forêt Vierge qui s'appelait "Histoires Vécues". Ça représentait un serpent boa qui avalait un fauve. Voilà la copie du dessin.

Le livre disait : "Les serpents boas avalent leur proie tout entière, sans la mâcher. Ensuite ils ne peuvent plus bouger et ils dorment pendant les six mois de leur digestion."

J'ai alors beaucoup réfléchi sur les aventures de la jungle et, à mon tour, j'ai réussi, avec un crayon de couleur, à tracer mon premier dessin. Mon dessin numéro 1. Il était comme ça : un chapeau ? Non ! Ça représentait un serpent boa qui digérait un éléphant.

J'ai alors dessiné l'intérieur du serpent boa, afin que les grandes personnes puissent comprendre. Elles ont toujours besoin d'explications. Mon dessin numéro 2 était comme ça...

Les grandes personnes m'ont conseillé de laisser de côté les dessins de serpents boas ouverts ou fermés, et de m'intéresser plutôt à la géographie, à l'histoire, au calcul et à la grammaire. C'est ainsi que j'ai abandonné, à l'âge de six ans, une magnifique carrière de peintre. J’avais été découragé par l’insuccès de mon dessin numéro 1 et de mon dessin numéro 2. Les grandes personnes ne comprennent jamais rien toutes seules, et c’est fatigant, pour les enfants, de toujours et toujours leur donner des explications.`
      },
      {
        id: "ch-2",
        title: "Chapitre II : Dessine-moi un mouton !",
        content: `J'ai ainsi vécu seul, sans personne avec qui parler véritablement, jusqu'à une panne dans le désert du Sahara, il y a six ans. Quelque chose s'était cassé dans mon moteur. Et comme je n'avais avec moi ni mécanicien, ni passagers, je me préparai à tenter, tout seul, une réparation difficile. C'était pour moi une question de vie ou de mort. J'avais à peine de l'eau à boire pour huit jours.

Le premier soir je me suis donc endormi sur le sable à mille milles de toute terre habitée. J'étais bien plus isolé qu'un naufragé sur un radeau au milieu de l'océan. Alors vous imaginez ma surprise, au lever du jour, quand une drôle de petite voix m'a réveillé. Elle disait :
— S'il vous plaît... dessine-moi un mouton !
— Hein !
— Dessine-moi un mouton...

Je me suis dressé sur mes pieds comme si j'avais été frappé par la foudre. J'ai bien frotté mes yeux. J'ai bien regardé. Et j'ai vu un petit bonhomme tout à fait extraordinaire qui me considérait avec gravité.

N'osant pas désobéir (bien que cela me parût absurde à mille milles de tous les endroits habités et en danger de mort), je sortis de ma poche une feuille de papier et un stylographe. Je lui dessinai donc le mouton. Il le regarda attentivement, puis :
— Non ! Celui-là est déjà très malade. Fais-en un autre.
Je dessinai encore. Mon ami sourit doucement, avec indulgence :
— Tu vois bien... ce n'est pas un mouton, c'est un bélier. Il a des cornes...
Je refusai alors le dernier dessin et j'en fis un nouveau qu'il rejeta encore.

Alors, fatigué de perdre du temps, je griffonnai un dessin d'une caisse munie de trois trous, et je lançais :
— Ça, c'est la caisse. Le mouton que tu veux est dedans.
Et je fus tout surpris de voir s'illuminer le visage de mon jeune juge :
— C'est tout à fait comme ça que je le voulais ! Crois-tu qu'il faille beaucoup d'herbe à ce mouton ? Parce que chez moi, c'est tout petit...`
      },
      {
        id: "ch-3",
        title: "Chapitre V : Le drame des Baobabs",
        content: `Chaque jour j'apprenais quelque chose, sur la planète, sur le départ, sur le voyage. Ça venait tout doucement, au hasard des réflexions. C'est ainsi que, le troisième jour, j'appris le drame des baobabs.

Cette fois-ci encore ce fut grâce au mouton, car brusquement le petit prince m'interrogea, comme pris d'un doute grave :
— C'est bien vrai, n'est-ce pas, que les moutons mangent les arbustes ?
— Oui. C'est vrai.
— Ah ! Je suis bien content.

Je ne compris pas pourquoi il était si important que les moutons mangeassent les arbustes. Mais le petit prince ajouta :
— Par conséquent ils mangent aussi les baobabs ?
Je fis remarquer au petit prince que les baobabs ne sont pas des arbustes, mais des arbres grands comme des églises et que, si même il emportait avec lui tout un troupeau d'éléphants, ce troupeau ne viendrait pas à bout d'un seul baobab.
L'idée du troupeau d'éléphants fit rire le petit prince :
— Il faudrait les mettre les uns sur les autres...
Mais il remarqua avec sagesse :
— Les baobabs, avant de grandir, ça commence par être petit.

Or, il y avait des graines terribles sur la planète du petit prince... c'étaient les graines de baobabs. Le sol de la planète en était infesté. Or un baobab, si l'on s'y prend trop tard, on ne peut plus jamais s'en débarrasser. Il encombre toute la planète. Il la perfore de ses racines. Et si la planète est trop petite, et si les baobabs sont trop nombreux, ils la font éclater !

« C'est une question de discipline, me disait plus tard le petit prince. Quand on a fini sa toilette du matin, il faut faire soigneusement la toilette de la planète. Il faut s'astreindre régulièrement à arracher les baobabs dès qu'on les distingue d'avec les rosiers auxquels ils ressemblent beaucoup quand ils sont très jeunes. C'est un travail très ennuyeux, mais très facile. »`
      },
      {
        id: "ch-4",
        title: "Chapitre XXI : Le secret du renard",
        content: `C'est alors qu'apparut le renard.
— Bonjour, dit le renard.
— Bonjour, répondit poliment le petit prince, qui se retourna mais ne vit rien.
— Je suis là, dit la voix, sous le pommier.
— Qui es-tu ? dit le petit prince. Tu es très joli...
— Je suis un renard, dit le renard.
— Viens jouer avec moi, lui proposa le petit prince. Je suis si triste...
— Je ne puis pas jouer avec toi, dit le renard. Je ne suis pas apprivoisé.
— Ah ! pardon, fit le petit prince. Mais, après réflexion, il ajouta : Qu'est-ce que signifie « apprivoiser » ?
— C'est une chose trop oubliée, dit le renard. Ça signifie « créer des liens... »
— Créer des liens ?
— Bien sûr, dit le renard. Tu n'es encore pour moi qu'un petit garçon tout semblable à cent mille petits garçons. Et je n'ai pas besoin de toi. Et tu n'as pas besoin de moi non plus. Je ne suis pour toi qu'un renard semblable à cent mille renards. Mais, si tu m'apprivoises, nous aurons besoin l'un de l'autre. Tu seras pour moi unique au monde. Je serai pour toi unique au monde...

Le renard revint à son idée :
— Ma vie est monotone. Je chasse les poules, les hommes me chassent. Toutes les poules se ressemblent, et tous les hommes se ressemblent. Je m'ennuie donc un peu. Mais, si tu m'apprivoises, ma vie sera comme ensoleillée. Je connaîtrai un bruit de pas qui sera différent de tous les autres... Et puis regarde ! Tu vois, là-bas, les champs de blé ? Je ne mange pas de pain. Le blé pour moi est inutile. Les champs de blé ne me rappellent rien. Et ça, c'est triste ! Mais tu as des cheveux couleur d'or. Alors ce sera merveilleux quand tu m'auras apprivoisé ! Le blé, qui est doré, me fera souvenir de toi. Et j'aimerai le bruit du vent dans le blé...

Ainsi le petit prince apprivoisa le renard. Et quand l'heure du départ fut proche :
— Ah ! dit le renard... Je pleurerai.
— C'est ta faute, dit le petit prince, je ne te voulais point de mal, mais tu as voulu que je t'apprivoise...
— Bien sûr, dit le renard.
— Mais tu vas pleurer ! dit le petit prince.
— Bien sûr, dit le renard.
— Alors tu n'y gagnes rien !
— J'y gagne, dit le renard, à cause de la couleur du blé.
Puis il ajouta : Va revoir les roses. Tu comprendras que la tienne est unique au monde. Tu reviendras me dire adieu, et je te ferai cadeau d'un secret.

Le petit prince s'en fut revoir les roses... puis il revint vers le renard :
— Adieu, dit-il...
— Adieu, dit le renard. Voici mon secret. Il est très simple : on ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.
— L'essentiel est invisible pour les yeux, répéta le petit prince, afin de se souvenir.
— C'est le temps que tu as perdu pour ta rose qui fait ta rose si importante.
— C'est le temps que j'ai perdu pour ma rose... fit le petit prince, afin de se souvenir.`
      }
    ]
  },
  {
    id: "avare",
    title: "L'Avare",
    author: "Molière",
    description: "Une comédie satirique féroce qui met en scène l'ineffable Harpagon, un homme dont l'obsession démesurée pour son argent détruit sa propre famille et s'attaque au bon sens.",
    coverGradient: "from-amber-600 via-yellow-700 to-amber-900 border border-yellow-500/30",
    coverIcon: "Coins",
    category: "Théâtre",
    rating: 4,
    year: "1668",
    wordCount: 22000,
    chapters: [
      {
        id: "av-1",
        title: "Acte I, Scène III : Harpagon et La Flèche",
        content: `HARPAGON.— Hors d'ici ce moment, et qu'on ne réplique mot ! Allons, que l'on détale de chez moi, maître juré filou, vraie potence à pendre.

LA FLÈCHE, à part.— Je n'ai jamais rien vu de si méchant que ce maudit vieillard, et je pense, sauf correction, qu'il a le diable au corps.

HARPAGON.— Tu murmures entre tes dents ?

LA FLÈCHE.— Pourquoi me chassez-vous ?

HARPAGON.— C'est bien à toi, traître, à me demander des raisons ! Sors vite, que je ne t'assomme.

LA FLÈCHE.— Qu'est-ce que je vous ai fait ?

HARPAGON.— Tu m'as fait que je veux que tu sortes.

LA FLÈCHE.— Mon maître, votre fils, m'a donné ordre de l'attendre.

HARPAGON.— Va-t'en l'attendre dans la rue, et ne sois point dans ma maison, planté tout droit comme un piquet, à observer ce qui se passe et faire ton profit de tout. Je ne veux point avoir sans cesse devant mes yeux un espion de mes affaires, un traître dont les yeux maudits assiègent toutes mes actions, dévorent ce que je possède, et furetent de tous côtés pour voir s'il n'y a rien à voler.

LA FLÈCHE.— Comment diable voulez-vous qu'on fasse pour vous voler ? Êtes-vous un homme volable, quand vous renfermez toutes choses, et faites sentinelle jour et nuit ?

HARPAGON.— Je veux renfermer ce que bon me semble, et faire sentinelle comme il me plaît ! Ne voilà pas de mes mouchards, qui prennent garde à ce qu'on fait ? (Bas, à part) Je tremble qu'il n'ait soupçonné quelque chose de mon argent. (Haut) Ne serais-tu point homme à aller faire courir le bruit que j'ai chez moi de l'argent caché ?

LA FLÈCHE.— Vous avez de l'argent caché ?

HARPAGON.— Non, coquin, je ne dis pas cela ! (Bas, à part) J'enrage ! (Haut) Je demande si, par malice, tu n'irais pas faire courir ce bruit.

LA FLÈCHE.— Hé ! qu'importe que vous en ayez ou que vous n'en ayez pas, si c'est pour nous la même chose ?`
      },
      {
        id: "av-2",
        title: "Acte III, Scène I : Les comptes et Maître Jacques",
        content: `HARPAGON.— Allons, venez çà tous, que je vous distribue mes ordres pour tantôt, et règle à chacun sa tâche. Approchez, Maître Jacques, je vous ai gardé pour le dernier.

MAÎTRE JACQUES.— Est-ce à votre cocher, Monsieur, ou bien à votre cuisinier, que vous voulez parler ? car je suis l'un et l'autre.

HARPAGON.— C'est à tous les deux.

MAÎTRE JACQUES.— Mais à quel des deux le premier ?

HARPAGON.— Au cuisinier.

MAÎTRE JACQUES.— Attendez, s'il vous plaît. (Il ôte sa casaque de cocher et paraît en cuisinier.) Me voilà prêt.

HARPAGON.— Maître Jacques, j'ai résolu de donner ce soir un souper.

MAÎTRE JACQUES, à part.— Grande merveille !

HARPAGON.— Dis-moi un peu, nous feras-tu bonne chère ?

MAÎTRE JACQUES.— Oui, si vous me donnez bien de l'argent.

HARPAGON.— La peste ! toujours de l'argent ! Il semble qu'ils n'aient autre chose à dire : « De l'argent ! de l'argent ! de l'argent ! » Ah ! c'est leur mot de guet, de l'argent ! Monsieur Valère, dites-moi un peu si un habile homme ne peut pas faire bonne chère avec peu d'argent ?

VALÈRE.— Oui, Maître Jacques. C'est l'un des dictons les plus célèbres du sage : « Il faut manger pour vivre, et non pas vivre pour manger. »

HARPAGON.— Ah ! que cela est bien dit ! C'est la plus belle sentence que j'aie entendue de ma vie. Je veux la faire graver en lettres d'or sur la cheminée de ma salle. Maître Jacques, entends-tu ? Il faut manger pour vivre, et non vivre pour manger. Souviens-toi bien de cela ! Nous ferons un souper léger, pour ne pas surcharger les estomacs. Des haricots, un peu de salade, une compote. Quelque chose qui rassasie vite.`
      },
      {
        id: "av-3",
        title: "Acte IV, Scène VII : Le Monologue Sacré de la Cassette",
        content: `(Harpagon entre en criant au voleur dès le jardin, et sans chapeau.)

HARPAGON.— Au voleur ! au voleur ! à l'assassin ! au meurtrier ! Justice, juste Ciel ! je suis perdu, je suis assassiné, on m'a coupé la gorge : on m'a dérobé mon argent !

Qui peut-ce être ? Qu'est-il devenu ? Où est-il ? Où se cache-t-il ? Que ferai-je pour le trouver ? Où courir ? Où ne pas courir ? N'est-il point là ? N'est-il point ici ? Qui est-ce ?

Arrête ! (Il se prend lui-même par le bras) Rends-moi mon argent, coquin... Ah ! c'est moi. Mon esprit est troublé, et je ne sais où je suis, qui je suis, et ce que je fais. Hélas ! mon pauvre argent, mon pauvre argent, mon cher ami ! On m'a privé de toi ; et puisque tu m'es enlevé, j'ai perdu mon support, ma consolation, ma joie ; tout est fini pour moi, et je n'ai plus que faire au monde : sans toi, il m'est impossible de vivre. C'en est fait, je n'en puis plus ; je me meurs, je suis mort, je suis enterré !

N'y a-t-il personne qui veuille me ressusciter, en me rendant mon cher argent, ou en m'apprenant qui l'a pris ?

Que dites-vous ? Ce n'est personne. Il faut, qui que ce soit qui ait fait le coup, qu'on ait épié l'heure avec beaucoup de soin ; et l'on a choisi justement le temps que je parlais à mon traître de fils.

Sortons. Je veux aller m'adresser à la justice, et faire donner la question à toute ma maison : à servantes, à valets, à fils, à fille, et à moi-même aussi ! Que de gens assemblés ! Je ne jette mes regards sur personne qui ne me donne des soupçons, et tout me semble mon voleur !

Eh ! de quoi est-ce qu'on parle là ? de celui qui m'a dérobé ? Quel bruit fait-on là-haut ? Est-ce mon voleur qui y est ? De grâce, si l'on sait des nouvelles de mon voleur, je supplie qu'on m'en dise. N'est-il point caché parmi vous ? Ils me regardent tous, et se mettent à rire. Vous verrez qu'ils ont part, sans doute, au vol dont on m'a fait victime.

Allons, vite, des commissaires, des archers, des prévôts, des juges, des gênes, des potences et des bourreaux ! Je veux faire pendre tout le monde ; et si je ne retrouve mon argent, je me pendrai moi-même après !`
      }
    ]
  },
  {
    id: "harry-potter",
    title: "Harry Potter : Guide du Survivant",
    author: "J.K. Rowling",
    description: "Plongez dans un guide magique d'analyse culturelle et littéraire du premier opus qui a révolutionné la fantasy moderne. Inclus, le jeu-trivia interactif du Choixpeau.",
    coverGradient: "from-purple-900 via-fuchsia-950 to-indigo-950 border border-fuchsia-500/30",
    coverIcon: "Wand",
    category: "Fantastique",
    rating: 5,
    year: "1997",
    wordCount: 18500,
    chapters: [
      {
        id: "hp-1",
        title: "Chapitre I : L'enfant de l'ombre à la lumière de Gryffondor",
        content: `Pour comprendre l'ampleur théâtrale de J.K. Rowling, il faut observer l'incroyable asymétrie entre le placard sous l'escalier poussiéreux chez les Dursley au 4, Privet Drive, et la grandeur dorée de la Grande Salle de Poudlard.

Le récit de Harry Potter s'enracine dans le mythe classique de l'orphelin prédestiné. Dès le premier soir, déposé sur le pas de la porte par Albus Dumbledore, Minerva McGonagall et Rubeus Hagrid, le bébé porte déjà le symbole d'une dualité insoluble : la cicatrice en forme d'éclair.

Cette cicatrice n'est pas seulement physique, elle est le pont magique qui relie l'antagoniste absolu (Lord Voldemort) et le héros. 

Rowling écrit la solitude de Harry avec un réalisme cruel : des vêtements trop grands hérités de son cousin Dudley, une absence totale d'amour maternel, et la punition récurrente d'être enfermé dans l'obscurité. Mais cette obscurité sert d'amplificateur de merveilleux. Lorsque les lettres d'admission écrites à l'encre verte envahissent la maison par la cheminée, le destin brise le pragmatisme des adultes moldus de manière irrévocable.`
      },
      {
        id: "hp-2",
        title: "Chapitre II : L'initiation au Chemin de Traverse",
        content: `Le Chemin de Traverse représente le seuil mythique de l'initiation. C'est le passage de la transition. On ne pénètre pas dans le monde des sorciers sans un rituel de passage: frapper précisément trois fois sur une brique du mur derrière le Chaudron Baveur.

Hagrid joue le rôle du passeur de fleuve (le mentor mythologique). Il guide Harry à travers la profusion de couleurs, de hiboux, de balais volants et de livres de sorts. 

L'événement culminant de l'initiation est le choix de la baguette magique chez Ollivander. Le magasin est silencieux, couvert de poussière magique :
— « C'est la baguette qui choisit son sorcier, Monsieur Potter », rappelle le vieux fabricant.

Chaque baguette contient un cœur magique (plume de phénix, crin de licorne, ventricule de dragon). Mais la surprise d'Ollivander résonne dans tout le magasin : le phénix qui a donné la plume de la baguette de Harry n'a donné qu'une seule autre plume... celle de la baguette qui a causé sa cicatrice. « Curieux... très curieux... » murmure-t-il.`
      },
      {
        id: "hp-3",
        title: "Chapitre III : Le Choixpeau et le Test des Quatre Maisons",
        content: `Une fois à Poudlard, l'identité du sorcier n'est plus définie par ses gênes ou son passé moldus, mais par son caractère profond, révélé par un artefact magique datant de mille ans : le Choixpeau magique.

Les quatre fondateurs de l'école ont imprégné le chapeau de leur propre discernement :
- **Gryffondor** favorise le courage, la hardiesse et la force d'âme.
- **Poufsouffle** chérit la loyauté, la patience, le travail acharné et la justice.
- **Serdaigle** recherche l'érudition, la sagesse, la créativité et la curiosité intellectuelle.
- **Serpentard** accueille l'ambition, la ruse, la grandeur et la loyauté de clan.

Lorsque le Choixpeau est posé sur la tête de Harry, il murmure :
— « Difficile... Très difficile. Je vois beaucoup de courage, une intelligence tout à fait convenable, et il y a du talent, oh oui ! Et une envie de faire de grandes choses... Alors, où te mettre ? »
Harry agrippe les bords du tabouret et répète intérieurement : « Pas Serpentard, pas Serpentard visez n'importe où sauf Serpentard... »
Le Choixpeau rit doucement : « Pas Serpentard ? Tu es sûr ? Tu pourrais devenir grand tu sais, c'est là que tu accomplirais ton destin... Non ? Eh bien si tu en es sûr... Ce sera : **GRYFFONDOR !** »`
      }
    ]
  },
  {
    id: "la-fontaine",
    title: "Les Fables Choisies",
    author: "Jean de La Fontaine",
    description: "Un recueil étincelant de poèmes allégoriques où les animaux s'animent pour châtier avec humour les travers humains et prodiguer d'immortelles sagesses.",
    coverGradient: "from-emerald-800 via-teal-900 to-green-950 border border-emerald-500/30",
    coverIcon: "Trees",
    category: "Poésie",
    rating: 5,
    year: "1668",
    wordCount: 12400,
    chapters: [
      {
        id: "lf-1",
        title: "Le Corbeau et le Renard",
        content: `Maître Corbeau, sur un arbre perché,
Tenait en son bec un fromage.
Maître Renard, par l'odeur alléché,
Lui tint à peu près ce langage :
"Hé ! bonjour, Monsieur du Corbeau.
Que vous êtes joli ! que vous me semblez beau !
Sans mentir, si votre ramage
Se rapporte à votre plumage,
Vous êtes le Phénix des hôtes de ces bois."

À ces mots, le Corbeau ne se sent pas de joie ;
Et pour montrer sa belle voix,
Il ouvre un large bec, laisse tomber sa proie.

Le Renard s'en saisit, et dit : "Mon bon Monsieur,
Apprenez que tout flatteur
Vit aux dépens de celui qui l'écoute :
Cette leçon vaut un fromage, sans doute."

Le Corbeau honteux et confus
Jura, mais un peu tard, qu'on ne l'y prendrait plus.`
      },
      {
        id: "lf-2",
        title: "La Cigale et la Fourmi",
        content: `La Cigale, ayant chanté
Tout l'été,
Se trouva fort dépourvue
Quand la bise fut venue.
Pas un seul petit morceau
De mouche ou de vermisseau.

Elle alla crier famine
Chez la Fourmi sa voisine,
La priant de lui prêter
Quelque grain pour subsister
Jusqu'à la saison nouvelle.
"Je vous paierai, lui dit-elle,
Avant l'août, foi d'animal,
Intérêt et principal."

La Fourmi n'est pas prêteuse ;
C'est là son moindre défaut.
"Que faisiez-vous au temps chaud ?
Dit-elle à cette emprunteuse.
— Nuit et jour à tout venant
Je chantais, ne vous déplaise.
— Vous chantiez ? j'en suis fort aise :
Eh bien ! dansez maintenant."`
      }
    ]
  }
];
