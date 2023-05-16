import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/react";
import clientPromise from '../../lib/mongodb';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { IconButton, ThemeProvider, createTheme } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useState, useEffect } from 'react';

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

interface SearchProps {
  wines: Wine[];
  totalPages: number;
  currentPage: number;
}

const ITEMS_PER_PAGE = 10;
const MAX_BUTTONS = 5;

const theme = createTheme({
  palette: {
    primary: {
      main: '#00000',
    },
    secondary: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

export default function Search({ wines, totalPages, currentPage }: SearchProps) {
  const router = useRouter();

  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  function handleWineClick(wine: Wine) {
    localStorage.setItem('WINE' + wine._id, JSON.stringify(wine));
    router.push(`/wine/${wine._id}`);
  }

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    if (pageNumber === 1) {
      router.push(`/main/search`);
    } else {
      router.push(`/main/search?page=${pageNumber}`);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    const startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
    const endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 1);

    if (currentPage > 1) {
      buttons.push(
        <button
          key="previous"
          className="mx-1 px-2 py-1 rounded-md bg-gray-200 text-gray-600"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`mx-1 px-2 py-1 rounded-md ${currentPage === i ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          className="mx-1 px-2 py-1 rounded-md bg-gray-200 text-gray-600"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="grid justify-center mt-5">
      {wines.map((wine: Wine, index: number) => (
        <>
          <div key={index} className={`relative p-5 mb-4 max-w-sm mx-5 bg-gradient-to-t from-dijon to-dijon/50 rounded-xl shadow-xl flex items-center space-x-4`}>

            <div className="flex-shrink-0">
              <Image src="/white-sauvignon.png" alt="Wine image" width={50} height={50} />
            </div>
            <div>
              <div className="text-md font-semibold text-black">{wine.title}</div>
              <p className="text-sm uppercase tracking-widest font-medium text-gray">{wine.variety}</p>
              <p className="text-sm text-gray-500 tracking-widest">${wine.price ? wine.price : 'No price listed'}</p>
              <p className="text-md uppercase tracking-widest font-bold text-green">{wine.points} / 100</p>
            </div>
            <div className="absolute bottom-0 right-3 mb-4">
              <IconButton href="/">
                <button>
                  <ThemeProvider theme={theme}>
                    <ArrowCircleRightIcon fontSize="large" color="primary" />
                  </ThemeProvider>
                </button>
              </IconButton>
            </div>
          </div>
        </>
      ))}

      <div className="flex justify-center">
        {renderPaginationButtons()}
      </div>

    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise;
  const db = await client.db('Wine1');

  const page = context.query.page ? Number(context.query.page) : 1; // Get the current page number from the query parameters

  const totalWines = await db.collection('wset').countDocuments(); // Get the total number of wines
  const totalPages = Math.ceil(totalWines / ITEMS_PER_PAGE); // Calculate the total number of pages

  const skip = (page - 1) * ITEMS_PER_PAGE; // Calculate the number of wines to skip


  const wines = await db
    .collection('wset')
    .find({})
    .sort({ points: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .toArray();

  return {
    props: {
      wines: JSON.parse(JSON.stringify(wines)),
      totalPages,
      currentPage: page,
    },
  };
};