import { getImages } from 'utils/api';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    images: [],
    per_page: 12,
    currentPage: 1,
    query: '',
    isLoadMorePresent: false,
    loading: false,
    isModalShown: false,
    currentModalImg: {
      largeImageURL: '',
      alt: '',
    },
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.currentPage !== this.state.currentPage
    ) {
      this.fetchNextPage();
    }
  }

  fetchNextPage = async () => {
    this.setState({ loading: true });

    try {
      const fetchData = await getImages({
        per_page: this.state.per_page,
        currentPage: this.state.currentPage,
        query: this.state.query,
      });

      this.setState(prevState => {
        return {
          images: [...prevState.images, ...fetchData.data.hits],
          isLoadMorePresent: fetchData.data.hits.length === prevState.per_page,
        };
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  onSubmit = ev => {
    ev.preventDefault();

    const inputValue = ev.currentTarget.elements.search.value;

    this.setState({
      query: inputValue,
      currentPage: 1,
      loading: true,
      images: [],
      isLoadMorePresent: false,
    });
  };

  handleLoadMoreBtnClick = () => {
    this.setState(prevState => {
      return { currentPage: prevState.currentPage + 1 };
    });
  };

  handleModalOpen = (largeImageURL, tags) => {
    this.setState({
      isModalShown: true,
      currentModalImg: {
        largeImageURL: largeImageURL,
        alt: tags,
      },
    });
  };

  handleModalClose = ev => {
    if (ev.code === 'Escape' || ev.target === ev.currentTarget) {
      this.setState({ isModalShown: false });
    }
  };

  render() {
    const {
      images,
      loading,
      isLoadMorePresent,
      isModalShown,
      currentModalImg,
    } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.onSubmit} />
        <ImageGallery images={images} handleModalOpen={this.handleModalOpen} />
        {loading && <Loader />}
        {isLoadMorePresent && (
          <Button handleLoadMoreBtnClick={this.handleLoadMoreBtnClick} />
        )}
        {isModalShown && (
          <Modal
            image={currentModalImg}
            handleModalClose={this.handleModalClose}
          />
        )}
        <ToastContainer />
      </>
    );
  }
}
