import { FILLUPS_COLLECTION } from './constants';

export function totalMileage(db, userId) {
  db
    .collection(FILLUPS_COLLECTION)
    .where('userId', '==', userId)
    .onSnapshot(querySnapshot => {
      let totalMileage = 0;
      querySnapshot.forEach(doc => {
        totalMileage =
          totalMileage + Math.round(doc.data().kilometers * 100) / 100;
      });
      console.log('totalMileage ->', totalMileage);
    });
}
