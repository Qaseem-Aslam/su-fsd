
import { NextResponse } from "next/server";

const data = [
'2023-06-25 11:00;1cbc.txt',
'2023-06-25 11:00;1abc.txt',
'2023-06-25 12:00;abc.txt',
'2023-06-25 16:00;20-abc.txt',
'2023-06-25 14:00;0010abc.txt',
'2023-06-25 15:00;011abc.txt',
'2023-06-25 20:00;abc010.txt',
'2023-06-25 17:00;021-abc.txt',
'2023-06-25 18:00;002-abc.txt',
'2023-06-25 19:00;cba.txt',
'2023-06-25 13:00;01abc.txt',
'2023-06-25 21:00;abc1.txt'
]

const sortFiles = (dataSplited: string[], sortBy: 'asc' | 'desc') => {
 return dataSplited.sort((a, b) => {
  const fileNameA = a.split(';')[1];
  const fileNameB = b.split(';')[1];

  const regex = /(\d+|\D+)/g;
  const aSplitted = fileNameA.match(regex);
  const bSplitted = fileNameB.match(regex);

  console.log({ aSplitted, bSplitted })

  if (!aSplitted || !bSplitted) return 0;
  
  for (let i = 0; i < Math.min(aSplitted?.length, bSplitted?.length); i++) {
    const partA = aSplitted[i];
    const partB = bSplitted[i];


    if (partA === partB) continue;

    const numA = Number(partA);
    const numB = Number(partB);
    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return  sortBy == 'asc'?  numA - numB : numB - numA;
    } else {
      let cmp;
      if (sortBy == 'asc') {
        cmp = partA.localeCompare(partB, undefined, { sensitivity: 'base' });
      } else { 
        cmp = partB.localeCompare(partA, undefined, { sensitivity: 'base' });
      }
      
      if (cmp !== 0) return cmp;
    }
  }

  return aSplitted.length - bSplitted.length;
 });
};

const sortByDate = (data: string[]): string[] =>  {
  return data.sort((a, b) => {
    const createdAtA = a.split(';')[0];
    const createdAtB = b.split(';')[0];
    return new Date(createdAtA).valueOf() - new Date(createdAtB).valueOf();
  })
}

const formatFiles = (files: string[]): { createdAt: string, filename: string }[] => {

  return files.map(file => {
    const [createdAt, filename] = file.split(';');
    return { createdAt, filename };
  });

}

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const sortBy = searchParams.get("sortBy");

  switch (sortBy) {
    case "date": 
      return NextResponse.json(formatFiles(sortByDate(data)));
    case "filename-desc":
    return NextResponse.json(formatFiles(sortFiles(data, 'desc')));
    case "filename-asc":
      return NextResponse.json(formatFiles(sortFiles(data, 'asc')));
      break;
    default: 
      return NextResponse.json(dataSplited);
  }
}

