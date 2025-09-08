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
	IItemClicked,
	DisplayItemsElements,
} from './components/ItemsGallaryView';
import {
	ModalWrapperEvents,
	ModalWrapperView,
} from './components/ModalWrapperView';
import {
	ModalCardViewEvents,
	CardPreviewButtonClickedPayload,
	ModalCardView,
} from './components/ModalCardView';

// Главный контейнер страницы
const page: HTMLElement = ensureElement('.page');

// Темплейт для заполнения данными для галереи
const galleryTemplate: HTMLTemplateElement =
	page.querySelector('#card-catalog');

// Контейнер, где будет располагаться галерея
const elementForGalary: HTMLElement = ensureElement('.gallery', page);
if (!galleryTemplate) {
	throw new Error('Шаблон галереи не найден');
}

// Темплейт для заполнения обёртки модального окна
const previewTemplate: HTMLTemplateElement =
	page.querySelector('#card-preview');
if (!previewTemplate) {
	throw new Error('Шаблон preview не найден');
}

// Обёртка для модального окна
const modalWrapper = ensureElement('.modal');

// Создание объекта эмиттера
const eventEmitter = new EventEmitter();

// Создание объекта API
const api = new Api(API_URL);

// Создание объекта Модели товаров
const itemsCatalogModel = new ItemsCatalogModel(eventEmitter);

// Создание объекта Отображения товаров на главной странице
const itemsGallaryView = new ItemsGallaryView(
	galleryTemplate,
	eventEmitter,
	elementForGalary
);

// Создание объекта Отображения Обёртки Модального окна
const modalWrapperView = new ModalWrapperView(modalWrapper, eventEmitter);

// Создание объекта Отображения Preview товара в модальной карточке
const modalCardView = new ModalCardView(previewTemplate, eventEmitter);

let itemsCatalog: IItemModel[] = [];

let displayItemsElements: DisplayItemsElements = {
	category: '',
	price: '',
};

//? Независимые события (не требуют данных?)

// Создание объекта Отображения хедера
const headerView = new HeaderView(page, eventEmitter);
// Подписка на клик по кнопке корзины
eventEmitter.on(HeaderEvents.BusketButtonClicked, function () {});

// Создание объекта Отображения корзины
const basketModel = new BasketModel(eventEmitter);
// Подписка на добавление товара в корзину
eventEmitter.on(BasketModelEvents.ItemAdded, function () {});
// Подписка на удаление товара из корзины
eventEmitter.on(BasketModelEvents.ItemDeleted, function () {});

const customer = new CustomerProcessingModel(eventEmitter);
// Подписка на добавление данных покупателя
eventEmitter.on(CustomerModelEvents.CustomerDataChanged, function () {});
const orderMakerModel = new OrderMakerModel(eventEmitter);
// Подписка на окончательное создание заказа
eventEmitter.on(OrderModelEvents.OrderDataCreated, function () {});

// Главная подписка на первоначальную загрузку и сохранение данных
eventEmitter.on(CatalogModelEvents.Initialized, function () {
	// Получаем массив обработанных и сохранённых данных из модели
	itemsCatalog = itemsCatalogModel.catalog;
	// Передаём в Отображение галереи данные для отрисовки
	itemsGallaryView.displayItems(itemsCatalog);

	// Теперь подписываемся на события, зависящие от данных
	// Подписка на событие Отрисовки товаров в галерее
	//eventEmitter.on(GalleryViewEvents.ItemsDisplayed, function () {}); - не нужно?

	// Подписка на клик по карточке в галерее
	eventEmitter.on<IItemClicked>(
		GalleryViewEvents.GalleryButtonClicked,
		({ cardId, category, price }) => {
			//----------
			console.log('Клик на карточке с id:', cardId);
			//----------
			displayItemsElements.category = category;
			displayItemsElements.price = price;
			itemsCatalogModel.setSelectedItem(cardId);
		}
	);

	// Подписка на событие сохранения выделенного кликнутого товара
	eventEmitter.on(CatalogModelEvents.ItemSelected, function () {
		let selectedItem = itemsCatalogModel.selectedItem;
		//----------
		//console.log(item);
		//console.log(displayItemsElements);
		//----------
		const readyItem = modalCardView.getItem(selectedItem, displayItemsElements);
		//console.log(HHH);
		modalWrapperView.insertContentAndDisplay(readyItem);
	});

	// Подписка на событие клика по кнопке закрытия модалки
	eventEmitter.on(ModalWrapperEvents.CloseButtonClicked, function () {
		modalCardView.clearProperties();
		modalWrapperView.closemodalWrapperAndClear();

		itemsCatalogModel.clearSelectedItem();

		console.log(itemsCatalogModel.selectedItem);
	});

	// Подписка на событие клика по кнопке Добавить в корзину
	eventEmitter.on(
		ModalCardViewEvents.CardPreviewButtonClicked,
		(payload: CardPreviewButtonClickedPayload) => {
			const id = payload.cardId;
			const item = basketModel.itemsList;
			const exists = item.some((previousItem) => previousItem.id === id);
			if (!exists) {
				basketModel.addItem(itemsCatalogModel.getItem(id));
			}
			console.log(basketModel.itemsList);
		}
	);
});

// Подключение к серверу для получения данных
api
	.get('/product/')
	.then((data: ApiListResponse<IItemModel>) => {
		// Передача данных в Модель после ответа сервера
		itemsCatalogModel.catalog = data['items'];
	})
	.catch((error) => {
		console.error('Ошибка при GET-запросе:', error);
	});
