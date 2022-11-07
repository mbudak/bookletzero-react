export type UserProfileUpdatedDto = {
  new: {
    firstName: string;
    lastName: string;
  };
  old: {
    firstName: string;
    lastName: string;
  };
  userId: string;
};
