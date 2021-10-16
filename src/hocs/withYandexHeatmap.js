import React from 'react';
import { attachYandexHeatmap } from 'utils';

function withYandexHeatmap(WrappedComponent) {
    return class extends React.Component {
        componentDidMount() {
            attachYandexHeatmap();
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}

export default withYandexHeatmap;