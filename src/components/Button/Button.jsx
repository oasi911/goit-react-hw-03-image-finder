import PropTypes from 'prop-types';

export const Button = ({ handleLoadMoreBtnClick }) => {
  return (
    <button className="Button" type="button" onClick={handleLoadMoreBtnClick}>
      Load more
    </button>
  );
};

Button.propTypes = {
  handleLoadMoreBtnClick: PropTypes.func.isRequired,
};
