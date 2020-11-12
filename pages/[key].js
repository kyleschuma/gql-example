import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';

function useSkiResortQuery(key) {
  return useQuery(
    gql`
      query SkiResortQuery($key: ID!) {
        item: getSkiResort(key: $key) {
          key
          name
          lifts {
            name
          }
          runs {
            name
          }
          nearby(distanceMiles: 50) {
            key
            name
          }
        }
      }
    `,
    {
      variables: { key },
    }
  );
}

export default function Index() {
  const router = useRouter();
  const { loading, error, data } = useSkiResortQuery(router.query.key);

  if (loading) return <p>Loading....</p>;
  if (error) return <p>Error...</p>;

  return (
    <>
      <header>
        <Link href="/">
          <a>Back</a>
        </Link>
        <h1>{data.item.name}</h1>
      </header>
      <h2>Lifts</h2>
      <ul>
        {data.item.lifts.map(item => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
      <h2>Runs</h2>
      <ul>
        {data.item.runs.map(item => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
      <h2>Resorts nearby</h2>
      <ul>
        {data.item.nearby.map(item => (
          <li key={item.key}>
            <Link href={`/${encodeURIComponent(item.key)}`}>
              <a>{item.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        header {
          margin-top: 1rem;
        }

        ul {
          list-style: none;
          padding: 0;
        }
        ul > li {
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
}
