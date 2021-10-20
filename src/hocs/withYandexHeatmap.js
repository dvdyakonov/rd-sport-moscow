import React from 'react';
import { attachYandexHeatmap } from 'utils';

function withYandexHeatmap(WrappedComponent) {
    return class extends React.Component {
        componentDidMount() {
            const {isYmapsInit} = this.props;
            if (isYmapsInit) {
                console.log(124);
                attachYandexHeatmap();   
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}

export default withYandexHeatmap;