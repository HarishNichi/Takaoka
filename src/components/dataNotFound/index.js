export const NotFound = (props) => {
    const { message } = props;
    return (
        <div className="not-found-container">
            <div className="not-found-message">
                {message}
            </div>
        </div>
    );
};
