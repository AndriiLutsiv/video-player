import styles from './page-error.module.scss';

interface PageErrorProps {
    className?: string;
}

const PageError = ({ className }: PageErrorProps) => {

    const refreshPage = () => {
        window.location.reload();
    };

    return <div className={styles.pageError} >
        <p>An unexpected error occured</p>
        <button
            onClick={refreshPage}
            className={styles.refreshButton}
        >
            Refresh the page
        </button>
    </div>;
};

export default PageError;