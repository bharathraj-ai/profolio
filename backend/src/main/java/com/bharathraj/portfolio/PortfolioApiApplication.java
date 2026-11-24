package com.bharathraj.portfolio;

import com.bharathraj.portfolio.config.EnvLoader;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;

import java.util.concurrent.TimeUnit;

@SpringBootApplication
@EnableCaching
public class PortfolioApiApplication {

	public static void main(String[] args) {
		EnvLoader.load();
		SpringApplication.run(PortfolioApiApplication.class, args);
	}

	/**
	 * Caffeine cache: entries expire 5 minutes after last write.
	 * @CacheEvict on admin writes still clears instantly;
	 * this TTL is a safety net for any stale entries.
	 */
	@Bean
	public CacheManager cacheManager() {
		CaffeineCacheManager manager = new CaffeineCacheManager();
		manager.setCaffeine(
			Caffeine.newBuilder()
				.expireAfterWrite(5, TimeUnit.MINUTES)
				.maximumSize(500)
		);
		return manager;
	}

}
