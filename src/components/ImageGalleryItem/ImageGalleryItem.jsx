import PropTypes from 'prop-types';

export const ImageGalleryItem = ({ image }) => {
  return (
    <li className="ImageGalleryItem" onClick={image.handleModalOpen}>
      <img
        className="ImageGalleryItem-image"
        src={image.webformatURL}
        alt={image.tags}
        data-large={image.largeImageURL}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }),
};
