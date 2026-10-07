export class CharacterAnimation {

    constructor(model) {

        this.model = model;

        this.mixer = null;

        this.actions = {};

        this.current = null;

        this.clock = 0;
    }


    setup(THREE) {

        if (
            !this.model ||
            !this.model.animations ||
            this.model.animations.length === 0
        ) {
            return;
        }

        this.mixer =
            new THREE.AnimationMixer(
                this.model
            );

        for (
            const clip
            of this.model.animations
        ) {

            this.actions[
                clip.name
            ] =
                this.mixer.clipAction(
                    clip
                );
        }
    }


    play(name) {

        const action =
            this.actions[name];

        if (!action) return;

        if (this.current === action) {
            return;
        }

        if (this.current) {

            this.current.fadeOut(
                .2
            );
        }

        action
            .reset()
            .fadeIn(.2)
            .play();

        this.current =
            action;
    }


    update(delta) {

        if (this.mixer) {

            this.mixer.update(
                delta
            );
        }
    }
}