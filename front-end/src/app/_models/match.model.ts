import { User } from './user.model';

export class Match {
	// tslint:disable-next-line:variable-name
  _id: string;
  users: User[];
  compatibilityScore: number;
  compatibilityResultsObject: compatibilityResultsObject[];
  locationResultsObject: {
    distance: number,
    score: number
  }
}

// needs defined in both node models and here
class compatibilityResultsObject {
  _id: string;
  name: string;
  target_id: string;
  target_name: string;
  totalCompatibilityScore: number;
  age: {
    ageMatchScore: number;
    ageDifference: number;
  }
  interestCategory: {
    interestCategoryMatchScore: number;
    countOfInterestCategoryMatches: number;
  }
  interest: {
      interestMatchScore: number;
      countOfInterestMatches: number;
      interestMatched: number;
  }
}
