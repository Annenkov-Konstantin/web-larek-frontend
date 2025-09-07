import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ApiListResponse, Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import {
	CatalogModelEvents,
	ItemsCatalogModel,
} from './components/ItemsCatalogModel';
import { IItemModel, ItemGallery } from './types/index';
import { BasketModelEvents, BasketModel } from './components/BasketModel';
import {
	CustomerModelEvents,
	CustomerProcessingModel,
} from './components/CustomerProcessingModel';
import {
	OrderModelEvents,
	OrderMakerModel,
} from './components/OrderMakerModel';
import { ensureElement } from './utils/utils';
import { HeaderEvents, HeaderView } from './components/HeaderView';
import {
	GalleryViewEvents,
	ItemsGallaryView,
} from './components/ItemsGallaryView';
import {
	ModalWrapperEvents,
	ModalWrapperView,
} from './components/ModalWrapperView';

const page: HTMLElement = ensureElement('.page');
const elementForGalary: HTMLElement = ensureElement('.gallery', page);
const galleryTemplate: HTMLTemplateElement =
	page.querySelector('#card-catalog');
if (!galleryTemplate) {
	throw new Error('Шаблон галереи не найден');
}
const modalWrapper = ensureElement('.modal');

const eventEmitter = new EventEmitter();

const api = new Api(API_URL);

const itemsCatalogModel = new ItemsCatalogModel(eventEmitter);

api
	.get('/product/')
	.then((data: ApiListResponse<IItemModel>) => {
		itemsCatalogModel.catalog = data['items'];
	})
	.catch((error) => {
		console.error('Ошибка при GET-запросе:', error);
	});

const itemsGallaryView = new ItemsGallaryView(
	galleryTemplate,
	eventEmitter,
	elementForGalary
);

let itemsCatalog: IItemModel[] = [];

eventEmitter.on(CatalogModelEvents.Initialized, function () {
	itemsCatalog = itemsCatalogModel.catalog;
	itemsGallaryView.displayItems(itemsCatalog);
});

eventEmitter.on(CatalogModelEvents.ItemSelected, function () {});

const modalWrapperView = new ModalWrapperView(modalWrapper, eventEmitter);
eventEmitter.on(ModalWrapperEvents.CloseButtonClicked, function () {
	modalWrapperView.closemodalWrapperAndClear();
});
const hhh = ensureElement('.card_full');

eventEmitter.on<{ cardId: string }>(
	GalleryViewEvents.GalleryButtonClicked,
	({ cardId }) => {
		console.log('Клик на карточке с id:', cardId);

		modalWrapperView.insertContentAndDisplay(hhh);
	}
);

eventEmitter.on(CustomerModelEvents.CustomerDataChanged, function () {});

eventEmitter.on(OrderModelEvents.OrderDataCreated, function () {});

const headerView = new HeaderView(page, eventEmitter);
eventEmitter.on(HeaderEvents.BusketButtonClicked, function () {});

const basketModel = new BasketModel(eventEmitter);

eventEmitter.on(BasketModelEvents.ItemAdded, function () {});

eventEmitter.on(BasketModelEvents.ItemDeleted, function () {});

const customer = new CustomerProcessingModel(eventEmitter);

const orderMakerModel = new OrderMakerModel(eventEmitter);
