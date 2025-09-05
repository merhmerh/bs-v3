<script>
let { serviceData } = $props();
</script>

<div class="modal">
	<div class="modal-header">
		<div class="profile-image">
			<img src={serviceData.profilePic} alt="Profile-pic" />
		</div>
		<p>{serviceData.userName}</p>
	</div>

	<div class="modal-body">
		<h2>{serviceData.title}</h2>
		<span>Vedio {serviceData.duration} mins</span>
		<div class="input-filed">
			<div class="name-input">
				<label for="name">Name</label>
				<input type="text" id="name" value="" placeholder="Enter Your Name" />
			</div>
			<div class="email-input">
				<label for="email">Email</label>
				<input type="text" value="" id="email" placeholder="Enter Your Email" />
			</div>
		</div>
	</div>
	<div class="modal-footer">
		<div class="price">
			<span>{serviceData?.currency} ${serviceData?.price}</span>
		</div>
		<div class="book-service">
			<button>Confirm Details</button>
		</div>
	</div>
</div>

<style lang="scss">
.modal {
	position: fixed;
	z-index: 100;
	top: 0;
	width: 40rem;
	height: 96%;
	background-color: var(--bg-100);
	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
	transition: right 0.3s ease-in-out;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 1rem;
	border-radius: 1rem;
	right: 0;
	overflow-y: auto;
	scroll-behavior: smooth;
	padding-bottom: 2rem;
	.modal-header {
		display: flex;
		align-items: center;
		padding: 0 2rem;
		margin-top: 2rem;
		gap: 1.5rem;
		p {
			font-weight: 600;
		}
		.profile-image {
			width: 4rem;
			height: 4rem;
			border: 1px solid var(--border-base);
			background-color: var(--bg-100);
			border-radius: 100%;

			img {
				height: 100%;
				width: 100%;
				border-radius: 100%;
			}
		}
	}
	.modal-body {
		display: flex;
		flex-direction: column;
		padding: 0 2rem;
		.input-filed {
			display: flex;
			flex-direction: column;
			margin-top: 2rem;
			gap: 2rem;

			.name-input,
			.email-input {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}
		}
	}
	.modal-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 1rem 0;
		border-top: 2px solid var(--border-base);
		padding: 2rem;
		position: fixed;
		bottom: 0;
		width: 45%;
		.price {
			span {
				font-weight: 600;
				border: 2px solid var(--border-base);
				padding: 0.5rem;
				border-radius: 2rem;
			}
		}
	}
}
@media (max-width: 425px) {
	.modal {
		top: 4rem;
		width: 91%;
		height: 87%;
		margin: 1rem;
		padding-bottom: 1rem;
		border-radius: 1rem;
		.modal-header {
			p {
				font-size: 1rem;
			}
		}

		.modal-body {
			h2 {
				font-size: 1.3rem;
			}
		}

		.modal-footer {
			width: 91%;
			padding: 0.5rem;
			.price span {
				font-size: 1rem;
			}
		}
	}
}
</style>
