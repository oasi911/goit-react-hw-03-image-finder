import axios from 'axios';
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

  async getImages() {
    try {
      const { API_KEY, per_page, currentPage, query } = this.state;
      this.setState({ loading: true });
      const response = await axios.get(
        `https://pixabay.com/api/?q=${query}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${per_page}`
      );
      return response;
    } catch (error) {
      toast.error(error.message);
    } finally {
      this.setState({ loading: false });
    }
  }

  onSubmit = ev => {
    ev.preventDefault();

    const inputValue = ev.currentTarget.elements.search.value;

    this.setState(
      { query: inputValue, images: [], currentPage: 1 },
      async () => {
        const fetchData = await this.getImages();

        this.setState(
          prevState => {
            return {
              images: [...prevState.images, ...fetchData.data.hits],
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
      }
    );
  };

  handleLoadMoreBtnClick = () => {
    this.setState(
      prevState => {
        return { currentPage: prevState.currentPage + 1 };
      },
      async () => {
        const fetchData = await this.getImages();

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
      }
    );
  };

  handleModalOpen = ev => {
    this.setState({ isModalShown: true }, () => {
      this.setState({
        currentModalImg: {
          largeImageURL: ev.target.getAttribute('data-large'),
          alt: ev.target.getAttribute('alt'),
        },
      });
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
