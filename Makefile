IMAGE_NAME = vtex/checkout-ui-healthckeck-$(ENVIRONMENT)

run: build
	docker run --shm-size 1024M --rm -it $(IMAGE_NAME)

deamon: build
	docker run --shm-size 1024M -d $(IMAGE_NAME)

build: .
	docker build -f ./dockerfiles/$(ENVIRONMENT)/Dockerfile -t $(IMAGE_NAME) --build-arg HORUS_PROXY_KEY .