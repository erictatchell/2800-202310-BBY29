// Importing necessary modules and functions from Next.js and next-auth
import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/react";

// Importing the MongoClient Promise that was set up in the mongodb.tsx file
import clientPromise from '../../lib/mongodb';

// Defining a TypeScript interface for the structure of a wine object
interface Wine {
  _id: string;
  id: number;
  country: string;
  description: string;
  designation: string;
  points: number;
  price: number;
  province: string;
  region_1: string;
  region_2: string;
  taster_name: string;
  taster_twitter_handle: string;
  title: string;
  variety: string;
  winery: string;
}

// Defining a TypeScript interface for the props that the TopPicks component will receive
interface TopPicksProps {
  wines: Wine[];
}

// The main TopPicks component which receives an array of wine objects as a prop
export default function TopPicks({ wines }: TopPicksProps) {
    return (
        <div>
            <h1>Top Picks page</h1>
            {/* Mapping over the wines array and creating a div for each wine */}
            {wines.map((wine: Wine, index: number) => (
                <div key={index}>
                    <h2>{wine.title}</h2>
                    <p>{wine.description}</p>
                    {/* More fields from the wine object can be rendered here */}
                </div>
            ))}
        </div>
    )
}

// The getServerSideProps function runs on the server side before the page is rendered
// It fetches the data that the page needs to render
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Waiting for the MongoDB client connection to be ready
    const client = await clientPromise;
    
    // Selecting the 'Wine1' database
    const db = client.db('Wine1'); 

    // Fetching the first 10 documents from the 'wset' collection in the 'Wine1' database
    const wines = await db
        .collection('wset')
        .find({})
        .limit(10)
        .toArray();

    // Returning the fetched data as props to the TopPicks component
    // The data is stringified and parsed to ensure it is serializable
    return {
        props: {
            wines: JSON.parse(JSON.stringify(wines)),
        },
    };
};


