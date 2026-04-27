import { Text } from "./typography";

export const TableUserProfile = ({ name, email, img_url = "" }) => {
  const profileName =
    name.split(" ")[0][0].toUpperCase() + name.split(" ")[1][0].toUpperCase();
  return (
    <div className="flx gap-2">
      {img_url ? (
        <img src={img_url} className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <div className="center h-9 w-9 center rounded-full bg-primary/10 text-primary font-semibold">
          {profileName}
        </div>
      )}
      <div>
        <h2 className="font-medium text-sm">{name}</h2>
        <Text variant="sm">{email}</Text>
      </div>
    </div>
  );
};
