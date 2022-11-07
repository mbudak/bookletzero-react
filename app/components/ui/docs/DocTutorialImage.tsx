interface Props {
  alt: string;
  src: string;
}

export default function DocTutorialImage({ alt, src }: Props) {
  return (
    <div className="border-gray-500 border-2 border-dashed">
      <img className="bg-gray-100 rounded-lg object-cover mx-auto shadow-2xl" alt={alt} src={src} />
    </div>
  );
}
