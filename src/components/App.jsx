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
    API_KEY: '34881705-1e85e8c708a083119a0406cc9',
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
    if (prevState.currentPage !== this.state.currentPage) {
      this.fetchNextPage();
    }
  }

  onSubmit = async ev => {
    ev.preventDefault();

    const inputValue = ev.currentTarget.elements.search.value;

    this.setState({
      query: inputValue,
      currentPage: 1,
      loading: true,
    });

    try {
      const fetchData = await getImages({
        API_KEY: this.state.API_KEY,
        per_page: this.state.per_page,
        currentPage: 1,
        query: inputValue,
      });

      this.setState(
        prevState => {
          return {
            images: [...fetchData.data.hits],
          };
        },
        () => {
          if (fetchData.data.hits.length === 0) {
            this.setState({ isLoadMorePresent: false });
            toast.warning("Sorry, there's no images found!");
          } else if (
            fetchData.data.hits.length < this.state.per_page ||
            fetchData.data.totalHits <= this.state.per_page
          ) {
            this.setState({ isLoadMorePresent: false });
            toast.warning("You've reached the end of search results!");
          } else {
            this.setState({ isLoadMorePresent: true });
          }
        }
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  async fetchNextPage() {
    try {
      const fetchData = await getImages({
        API_KEY: this.state.API_KEY,
        per_page: this.state.per_page,
        currentPage: this.state.currentPage,
        query: this.state.query,
      });

      this.setState(
        prevState => {
          return {
            images: [...prevState.images, ...fetchData.data.hits],
          };
        },
        () => {
          if (
            fetchData.data.hits.length < this.state.per_page ||
            fetchData.data.totalHits <= this.state.per_page
          ) {
            this.setState({ isLoadMorePresent: false });
            toast.warning("You've reached the end of search results!");
          }
        }
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      this.setState({ loading: false });
    }
  }

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
        {!loading && isLoadMorePresent && (
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
