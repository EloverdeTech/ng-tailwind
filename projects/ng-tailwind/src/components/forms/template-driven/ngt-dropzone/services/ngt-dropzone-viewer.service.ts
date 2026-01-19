import { Injectable } from '@angular/core';
import Viewer from 'viewerjs';

export interface ViewerConfig {
    navbar?: boolean;
    toolbar?: {
        zoomIn?: boolean;
        zoomOut?: boolean;
        reset?: boolean;
        rotateLeft?: boolean;
        rotateRight?: boolean;
        prev?: boolean;
        next?: boolean;
    };
    initialViewIndex?: number;
}

@Injectable()
export class NgtDropzoneViewerService {
    private readonly defaultConfig: ViewerConfig = {
        navbar: true,
        toolbar: {
            zoomIn: true,
            zoomOut: true,
            reset: true,
            rotateLeft: true,
            rotateRight: true,
            prev: true,
            next: true,
        }
    };

    public createImagePreview(resources: any[], filterCallback: (resource: any) => boolean): HTMLElement {
        const images = resources.filter(filterCallback);
        const imagesDiv = document.createElement('div');

        images.forEach((image) => {
            const imageElement = document.createElement('img');

            imageElement.src = image.file.url;

            imagesDiv.appendChild(imageElement);
        });

        return imagesDiv;
    }

    public showViewer(
        element: HTMLElement,
        index?: number,
        onHidden?: () => void,
        customConfig?: Partial<ViewerConfig>
    ): Viewer {
        const config = {
            ...this.defaultConfig,
            ...customConfig
        };

        if (index !== null && index !== undefined) {
            config.initialViewIndex = index;
        }

        const viewer = new Viewer(
            element,
            {
                ...config,
                hidden: () => {
                    if (onHidden) {
                        onHidden();
                    }

                    viewer.destroy();
                }
            }
        );

        viewer.show();

        return viewer;
    }
}
