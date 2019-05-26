import { useEffect } from 'react';

function useCdmEvent(id, db, setVote) {
  useEffect(() => {
    db.votesTable.get(id).then((vote) => {
      if (vote) {
        setVote(vote);
      }
    });
  // eslint-disable-next-line
  }, []);
}

// eslint-disable-next-line import/prefer-default-export
export { useCdmEvent };
