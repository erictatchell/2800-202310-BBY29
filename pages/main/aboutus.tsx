import { getSession } from 'next-auth/react';
import Link from 'next/link';
import clientPromise from '../../lib/mongodb';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

// Members of the team info that is displayed on the about us cards
const teamMembers = [
  {
    name: "Eric Tatchell",
    image: "/eric1.png",
    description: "Eric is a passionate developer with a love for music. He loves The Weekend and Drake! Eric is our backend and AI guru.",
    linkedIn: "https://www.linkedin.com/in/eftatchell/",
    instagram: "https://www.instagram.com/erictatchell/"
  },

  {
    name: "Brendan Doyle",
    image: "/brendan1.jpg",
    description: "Brendan's interests lie in developing interesting and easy to use UX and UI. He loves to golf and travel. He is the front end developer",
    linkedIn: "https://www.linkedin.com/in/brendan-j-doyle",
    instagram: "https://www.instagram.com/brendoyle1/"
  },

  {
    name: "Noor Sangha",
    image: "/noor1.jpg",
    description: "Noor is a developer with an eye for details. She loves working on cars and is our database designer.",
    linkedIn: "https://www.linkedin.com/in/noor-sangha-277a32240/",
    instagram: "https://www.instagram.com/noorsangha/"
  },

  {
    name: "Victor Vasconcellos",
    image: "/victor3.jpg",
    description: "Victor is an aspiring project manager with a love for soccer. His nickname is Solar Panel because he loves the sun so much.",
    linkedIn: "https://www.linkedin.com/in/victor-vasconcellos-4ab255262/",
    instagram: "https://www.instagram.com/victor.amaim/"
  }
  // add more team members as needed
];

// About Us team information and members cards
export default function aboutUs() {
  return (
    <div className="mx-auto z-50 p-4 sm:p-6 lg:p-8">
      {/*About the project*/}
      <div className="text-center bg-dijon/70 shadow-md rounded-md overflow-hidden p-6 mb-10 divide-y">
        <p className="mt-2 text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-xl">
          About our project
        </p>
        <p className="mt-4 max-w-2xl text-m text-gray-900 lg:mx-auto">
          Our team, Code and Cork, is proudly developing Wine Whisperer, an AI-driven platform designed to empower farmers,
          vintners, and small businesses in the pursuit of sustainable wine making. Our mission is to connect eco-conscious
          wine enthusiasts with a diverse selection of environmentally friendly and delicious wines.
          By harnessing the power of AI, Wine Whisperer is changing the way we discover, enjoy, and share sustainable wines.
        </p>
      </div>
      {/*About the team and button for the easter egg*/}
      <Link href="/main/404" className='cursor-default'>
        <div className="text-center bg-dijon/70 shadow-md rounded-md overflow-hidden p-6 divide-y">
          <p className="mt-2 text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-xl">
            Meet our amazing team
          </p>
          <p className="mt-4 max-w-2xl text-m text-gray-900 lg:mx-auto">
            Brendan Doyle, Eric Tatchell, Noor Sangha, and Victor Vasconcellos, are a highly motivated and cohesive
            group from the British Columbia Institute of Technology. We share a passion for software development and aspire
            to make a positive impact on society through our knowledge and hard work.
          </p>
        </div>
      </Link>
      {/*About the team members, info is taken from teamMembers*/}
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center bg-dijon/70 shadow-2xl rounded-xl overflow-hidden max-w-xl sm:max-w-none">
            <div className="md:w-1/3">
              <img className="md:h-48 md:max-h-2/3 w-full object-cover md:w-48 rounded" src={member.image} alt={member.name}/>
            </div>
            <div className="mt-4 md:mt-0 md:w-2/3 p-4 divide-y">
              <h3 className="text-lg leading-6 font-bold ">
                {member.name}
              </h3>
              <p className="mt-2">
                {member.description}
              </p>
              <div className="mt-4">
                <a href={member.linkedIn} target="_blank" rel="noreferrer">
                  <LinkedInIcon className="inline mr-4 cursor-pointer hover:text-blue-600" />
                </a>
                <a href={member.instagram} target="_blank" rel="noreferrer">
                  <InstagramIcon className="inline cursor-pointer hover:text-pink-500" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

//Checking session and redirecting if not logged in.
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const userEmail = session && session.user ? session.user.email : null;
  if (userEmail) {
    const client = await clientPromise;
    const db = client.db();
    const userExtra = await db.collection("userExtras").findOne({ email: userEmail });
    if (userExtra) {
      return {
        props: {
          userId: userExtra.id,
        },
      };
    }
  }
  return {
    props: {},
  };
}