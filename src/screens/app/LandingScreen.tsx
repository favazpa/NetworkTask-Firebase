import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useLanguageStore } from '../../store/languageStore';
import { getProductsPage, getTotalPages, Product, ITEMS_PER_PAGE } from '../../data/products';
import colors from '../../shared/theme/colors';
import type { RootStackParamList } from '../../navigation/types';
import { DEFAULTS } from '../../shared/constants';
import { Toast } from '../../shared/components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LandingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(s => s.user);
  const { addToCart, getTotalItems } = useCartStore();
  const { translations } = useLanguageStore();
  const [notification, setNotification] = useState<string | null>(null);
  
  // Pagination state
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const t = translations;
  const cartItemCount = getTotalItems();
  const totalPages = getTotalPages();

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), DEFAULTS.NOTIFICATION_DURATION);
  };

  // Load products for a specific page
  const loadProducts = useCallback(async (page: number, append: boolean = false) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      
      const newProducts = getProductsPage(page);
      
      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      
      setCurrentPage(page);
      setHasMoreData(page < totalPages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [totalPages]);

  // Load more products (pagination)
  const loadMoreProducts = useCallback(() => {
    if (!isLoading && hasMoreData) {
      const nextPage = currentPage + 1;
      loadProducts(nextPage, true);
    }
  }, [currentPage, isLoading, hasMoreData, loadProducts]);

  // Refresh products (pull-to-refresh)
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProducts(1, false);
    setIsRefreshing(false);
  }, [loadProducts]);

  // Initial load
  useEffect(() => {
    loadProducts(1, false);
  }, [loadProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    showNotification(`${product.title} ${t.landing?.addedToCart || 'added to cart!'}`);
  };

  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  const navigateToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="add" size={16} color="#000" />
            <Text style={styles.addButtonText}>{t.landing?.addToCart || 'Add to Cart'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={32} color={colors.accent} />
          <View style={styles.userDetails}>
            <Text style={styles.welcomeText}>{t.landing?.welcomeBack || 'Welcome back!'}</Text>
            <Text style={styles.username}>{user?.username || 'User'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={navigateToNotifications}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={navigateToCart}
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cartItemCount > DEFAULTS.CART_BADGE_THRESHOLD && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={navigateToSettings}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <View style={styles.productsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.landing?.products || 'Products'}</Text>
          <Text style={styles.pageInfo}>
            {t.landing?.pageInfo
              ? t.landing.pageInfo
                  .replace('{page}', currentPage.toString())
                  .replace('{totalPages}', totalPages.toString())
                  .replace('{items}', products.length.toString())
              : `Page ${currentPage} of ${totalPages} (${products.length} items)`}
          </Text>
        </View>
        
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          }
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color={colors.accent}
                  style={styles.loadingIndicator}
                />
              )}
              {!hasMoreData && products.length > 0 && (
                <Text style={styles.endMessage}>{t.landing?.noMoreProducts || 'No more products to load'}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Notification Toast */}
      <Toast
        message={notification || ''}
        visible={!!notification}
        onHide={() => setNotification(null)}
        type="success"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 60, android: 20 }),
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
  },
  welcomeText: {
    color: colors.sub,
    fontSize: 12,
  },
  username: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  email: {
    color: colors.sub,
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  pageInfo: {
    color: colors.sub,
    fontSize: 12,
    fontWeight: '500',
  },
  productsList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.muted,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    color: colors.sub,
    fontSize: 12,
    marginBottom: 8,
    flex: 1,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  endMessage: {
    color: colors.sub,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
