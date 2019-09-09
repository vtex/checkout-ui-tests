IMAGE_NAME = vtex/vtexid-hc

run: build
	docker run --shm-size 1024M --rm -it $(IMAGE_NAME)
	# docker run --ipc=host --rm -it $(IMAGE_NAME)

deamon: build
	docker run --shm-size 1024M -d $(IMAGE_NAME)

build: .
	docker build -t $(IMAGE_NAME) .
