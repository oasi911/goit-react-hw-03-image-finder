import { Component } from 'react';
import PropTypes from 'prop-types';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.props.handleModalClose);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.props.handleModalClose);
  }
  render() {
    const { image, handleModalClose } = this.props;

    return (
      <div className="Overlay" onClick={handleModalClose}>
        <div className="Modal">
          <img
            src={image.largeImageURL}
            alt={image.alt}
            width="800"
            height="600"
          />
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  image: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }),
  handleModalClose: PropTypes.func.isRequired,
};
