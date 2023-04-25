import PropTypes from 'prop-types';

export const ImageGalleryItem = ({
  webformatURL,
  tags,
  largeImageURL,
  handleModalOpen,
}) => {
  const handleClick = () => {
    handleModalOpen(largeImageURL, tags);
  };

  return (
    <li className="ImageGalleryItem" onClick={handleClick}>
      <img
        className="ImageGalleryItem-image"
        src={webformatURL}
        alt={tags}
        data-large={largeImageURL}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    handleModalOpen: PropTypes.func.isRequired,
  }),
};
